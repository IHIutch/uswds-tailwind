import { readdirSync, readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { componentCoverage, getComponentCoverage, missingComponentDocs } from '../src/content/component-coverage.ts'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../../..')
const docs = resolve(root, 'apps/docs/src/content/components')
const packageExports = {
  vanilla: JSON.parse(readFileSync(resolve(root, 'packages/compat/package.json'), 'utf8')).exports,
  react: JSON.parse(readFileSync(resolve(root, 'packages/react/package.json'), 'utf8')).exports,
}
const reactIndex = readFileSync(resolve(root, 'packages/react/src/index.ts'), 'utf8')
const compatIndex = readFileSync(resolve(root, 'packages/compat/src/index.ts'), 'utf8')
const errors = []
const pages = readdirSync(docs).filter(name => name.endsWith('.mdx')).map(name => name.slice(0, -4))
const knownPages = new Set(pages)

for (const slug of pages) {
  const item = componentCoverage[slug]
  if (!item) {
    errors.push(`${slug}: missing coverage entry`)
    continue
  }
  const source = readFileSync(resolve(docs, `${slug}.mdx`), 'utf8')
  const published = !/^isPublished:\s*false\s*$/m.test(source)
  if (published === (item.published === false))
    errors.push(`${slug}: published flag disagrees with MDX`)

  const previews = []
  let lastHeading = ''
  const lines = source.split('\n')
  for (const [index, line] of lines.entries()) {
    if (/^#{2,3} /.test(line)) {
      lastHeading = line.replace(/^#{2,3} /, '').trim()
      if (previews.length)
        previews.at(-1).end = index
    }
    if (line.includes('<ComponentPreview'))
      previews.push({ heading: lastHeading, start: index, end: lines.length })
  }
  const headings = previews.map(preview => preview.heading)
  if (JSON.stringify(headings) !== JSON.stringify(item.examples.map(example => example.heading)))
    errors.push(`${slug}: example headings differ; expected ${JSON.stringify(headings)}`)
  const composedDependencies = new Set()
  for (const [index, example] of item.examples.entries()) {
    if (!['covered', 'blocked'].includes(example.vanilla.status) || !example.vanilla.reason)
      errors.push(`${slug}/${example.heading}: Vanilla status needs a reason`)
    if (!['deferred', 'unsupported'].includes(example.react.status) || !example.react.reason)
      errors.push(`${slug}/${example.heading}: React status needs a reason`)
    if (item.react.kind === 'component' && example.react.status !== 'deferred')
      errors.push(`${slug}/${example.heading}: React source is not available yet`)
    if (item.react.kind !== 'component' && example.react.status !== 'unsupported')
      errors.push(`${slug}/${example.heading}: React package has no corresponding component`)
    const preview = previews[index]
    if (!preview)
      continue
    const markup = lines.slice(preview.start, preview.end).join('\n')
    for (const subpath of Object.keys(packageExports.vanilla).filter(path => path.startsWith('./')).map(path => path.slice(2))) {
      const used = markup.includes(`data-part="${subpath}-`)
      const declared = example.vanilla.dependencies.includes(subpath)
      if (item.vanilla.kind !== 'component' && used !== declared)
        errors.push(`${slug}/${example.heading}: ${subpath} initializer use differs from coverage`)
    }
    for (const subpath of example.vanilla.dependencies) {
      composedDependencies.add(subpath)
      if (!packageExports.vanilla[`./${subpath}`])
        errors.push(`${slug}/${example.heading}: Vanilla initializer ${subpath} is not exported`)
    }
  }
  const pageDependencies = item.vanilla.kind === 'composition' ? item.vanilla.dependencies ?? [] : []
  if (JSON.stringify([...composedDependencies].sort()) !== JSON.stringify([...pageDependencies].sort()))
    errors.push(`${slug}: page composition dependencies differ from variants`)
  if (item.examples.some(example => example.vanilla.status === 'blocked') && !item.publicBlockNotice)
    errors.push(`${slug}: blocked variants need public guidance`)
  for (const library of ['vanilla', 'react']) {
    const coverage = getComponentCoverage(slug, library)
    if (coverage.kind === 'component') {
      if (!packageExports[library][`./${coverage.subpath}`])
        errors.push(`${slug}: ${library} subpath ${coverage.subpath} is not exported`)
      const index = library === 'react' ? reactIndex : compatIndex
      if (!(library === 'react' && ['in-page-navigation', 'link'].includes(coverage.subpath)) && !index.includes(`'./${coverage.subpath}'`))
        errors.push(`${slug}: ${library} ${coverage.subpath} is missing from root index`)
    }
    else if (!coverage.note || !coverage.alternative) {
      errors.push(`${slug}: ${library} ${coverage.kind} needs a reason and useful alternative`)
    }
    else if (coverage.alternativePage && !knownPages.has(coverage.alternativePage)) {
      errors.push(`${slug}: ${library} alternative page ${coverage.alternativePage} does not exist`)
    }
  }
}

for (const slug of Object.keys(componentCoverage)) {
  if (!knownPages.has(slug))
    errors.push(`${slug}: coverage entry has no MDX page`)
}
for (const library of ['vanilla', 'react']) {
  const mapped = new Set(Object.values(componentCoverage)
    .map(page => page[library])
    .filter(coverage => coverage.kind === 'component')
    .map(coverage => coverage.subpath))
  const missing = missingComponentDocs[library]
  for (const subpath of Object.keys(packageExports[library]).filter(path => path.startsWith('./')).map(path => path.slice(2))) {
    if (['auto', 'init-all', 'styles.css'].includes(subpath))
      continue
    if (!mapped.has(subpath) && !Object.hasOwn(missing, subpath))
      errors.push(`${library}: exported ${subpath} is neither mapped nor listed as missing docs`)
  }
  for (const [subpath, gap] of Object.entries(missing)) {
    if (!packageExports[library][`./${subpath}`])
      errors.push(`${library}: missing-doc entry ${subpath} is not a package export`)
    if (mapped.has(subpath))
      errors.push(`${library}: ${subpath} has both a page and missing-doc entry`)
    if (!knownPages.has(gap.alternative) || !gap.reason)
      errors.push(`${library}: ${subpath} needs a valid alternative page and reason`)
  }
}

let rejectsUnknownLibrary = false
try {
  getComponentCoverage('button', 'other')
}
catch {
  rejectsUnknownLibrary = true
}
if (!rejectsUnknownLibrary)
  errors.push('Unknown library value was accepted')
if (errors.length) {
  console.error(errors.join('\n'))
  process.exitCode = 1
}
else {
  console.log(`Coverage verified: ${pages.length} MDX entries and all public component subpaths.`)
}
