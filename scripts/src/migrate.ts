import { dirname, join } from 'node:path'
import process from 'node:process'

import { findUpSync } from 'find-up'
import fs from 'fs-extra'
import { Project } from 'ts-morph'

const root = dirname(findUpSync('pnpm-lock.yaml')!)
process.chdir(join(root, 'apps', 'storybook'))

const demos = new Project({})
demos.addSourceFilesAtPaths(join('src', 'components', '**', '*.{twig,json}'))
const allDemoFiles = demos.getSourceFiles()

const props = new Project({})
props.addSourceFilesAtPaths(join('src', 'components', '**', '*.json'))
const allPropsFiles = props.getSourceFiles()

const variants = new Project({})
variants.addSourceFilesAtPaths(join('src', 'components', '**', 'examples', '*.twig'))
const allVariantFiles = variants.getSourceFiles()

const demoComponentsDir = join(root, 'apps', 'docs', 'src', '__demos__')
const demoContentDir = join(root, 'apps', 'docs', 'src', 'content', 'demos')

async function buildRegistryIndex() {
  await fs.remove(demoContentDir)

  await Promise.all(
    allVariantFiles.map(async (file) => {
      const component = file.getDirectory().getParent()?.getBaseName()
      if (!component) {
        console.log('Component baseName not found')
        return
      }

      const variantName = file.getBaseName()
      const props = allPropsFiles.find(propsFile => propsFile.getBaseNameWithoutExtension().startsWith(component))?.getBaseName()

      const data = {
        component,
        variant: variantName,
        propsPath: props ? join('src', '__demos__', component, props) : '',
        componentPath: join('src', '__demos__', component, 'examples', variantName),
      }

      const variant = file.getBaseNameWithoutExtension()
      const newPath = join(demoContentDir, `${variant}.json`)
      return await fs.outputFile(newPath, JSON.stringify(data, null, 2))
    }),
  )
}

// ----------------------------------------------------------------------------
// Build components/[component]-[variant].demo.twig
// ----------------------------------------------------------------------------

async function copyDemoComponents() {
  await fs.remove(demoComponentsDir)

  await Promise.all(
    allDemoFiles.map(async (file) => {
      const fileName = file.getBaseName()

      const fileContents = file.getText()
      const [_, relDir] = file.getDirectory().getPath().split('/components')
      const newPath = join(demoComponentsDir, relDir, fileName)

      return await fs.outputFile(newPath, fileContents)
    }),
  )
}

// ----------------------------------------------------------------------------
// Run
// ----------------------------------------------------------------------------

copyDemoComponents().catch((err) => {
  console.error(err.message)
  process.exit(1)
})

buildRegistryIndex().catch((err) => {
  console.error(err.message)
  process.exit(1)
})

console.log('✅ Done!')
