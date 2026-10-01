import { createProcessor } from '@mdx-js/mdx'

const processor = createProcessor()
const isElement = node => ['mdxJsxFlowElement', 'mdxJsxTextElement'].includes(node.type)
const attribute = (node, name) => node.attributes.find(attr => attr.type === 'mdxJsxAttribute' && attr.name === name)
const literalAttribute = (node, name) => typeof attribute(node, name)?.value === 'string' ? attribute(node, name).value : undefined

function nodesIn(node) {
  return [node, ...(node.children ?? []).flatMap(nodesIn)]
}

/** Validate the previews authored directly in React MDX, without a second registry. */
export function checkReactPreviews({ coverage, pageSources, exampleNames }) {
  const errors = []
  for (const [slug, source] of Object.entries(pageSources)) {
    const page = coverage[slug]
    if (!page) {
      errors.push(`${slug}: React document has no coverage entry`)
      continue
    }
    let ast
    try {
      ast = processor.parse(source.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, ''))
    }
    catch (error) {
      errors.push(`${slug}: cannot parse React MDX: ${error.message}`)
      continue
    }
    const imports = new Map()
    const nodes = nodesIn(ast)
    for (const node of nodes.filter(node => node.type === 'mdxjsEsm')) {
      for (const statement of node.data.estree.body) {
        if (statement.type !== 'ImportDeclaration')
          continue
        for (const specifier of statement.specifiers) {
          if (specifier.type === 'ImportDefaultSpecifier')
            imports.set(specifier.local.name, statement.source.value)
        }
      }
    }
    const elements = nodes.filter(isElement)
    const registrations = elements.filter(node => imports.get(node.name) === '#components/react-preview.astro')
    const registeredIslands = new Set()
    const variants = new Set()
    for (const node of registrations) {
      const variant = literalAttribute(node, 'variant')
      const example = literalAttribute(node, 'example')
      const label = `${slug}/${variant ?? '(missing variant)'}`
      const covered = page.examples.find(item => item.heading === variant)
      if (!covered)
        errors.push(`${label}: React preview points to an unknown variant`)
      else if (covered.react.status !== 'covered')
        errors.push(`${label}: React preview is not marked covered`)
      if (variants.has(variant))
        errors.push(`${label}: duplicate React preview registration`)
      variants.add(variant)
      if (typeof example !== 'string' || !exampleNames.has(example))
        errors.push(`${label}: unknown React example source ${String(example)}`)
      if (node.attributes.some(attr => attr.type === 'mdxJsxExpressionAttribute'))
        errors.push(`${label}: React registration attributes must be explicit`)

      const children = node.children.filter(child => child.type !== 'text' || child.value.trim())
      const island = children.length === 1 && isElement(children[0]) ? children[0] : undefined
      if (!island || !attribute(island, 'client:load')) {
        errors.push(`${label}: React preview needs one directly imported client:load island`)
        continue
      }
      registeredIslands.add(island)
      const importedSource = imports.get(island.name)
      if (importedSource !== `../../../examples/${example}` && importedSource !== `../../../examples/${example}.tsx`)
        errors.push(`${label}: rendered island does not match ${String(example)}.tsx`)
    }
    for (const node of elements) {
      if (node.name === 'ReactPreview' && !registrations.includes(node))
        errors.push(`${slug}: ReactPreview must import the shared registration component`)
      if (node.attributes.some(attr => attr.name?.startsWith('client:')) && !registeredIslands.has(node))
        errors.push(`${slug}: rendered island has no React preview registration`)
    }
    for (const item of page.examples) {
      if (item.react.status === 'covered' && !variants.has(item.heading))
        errors.push(`${slug}/${item.heading}: covered React variant has no preview registration`)
    }
  }
  for (const slug of Object.keys(coverage)) {
    if (!Object.hasOwn(pageSources, slug))
      errors.push(`${slug}: component has no React MDX document`)
  }
  return errors
}
