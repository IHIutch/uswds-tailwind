import type { Element, ElementContent, Nodes, Root } from 'hast'
import { fromHtml } from 'hast-util-from-html'
import { select, selectAll } from 'hast-util-select'
import { toMdast } from 'hast-util-to-mdast'
import { gfmToMarkdown } from 'mdast-util-gfm'
import { toMarkdown } from 'mdast-util-to-markdown'
import { stringify } from 'yaml'

function textContent(node: Nodes | undefined): string {
  if (!node)
    return ''
  if (node.type === 'text')
    return node.value
  return 'children' in node ? node.children.map(textContent).join('') : ''
}

function sourceBlock(pre: Element): Element {
  // Expressive Code splits rendered source lines into highlighted spans.
  const lines = selectAll('.ec-line .code', pre)
  const source = lines.length
    ? lines.map(line => textContent(line).replace(/\n$/, '')).join('\n')
    : textContent(select('code', pre) ?? pre)
  const language = pre.properties?.dataLanguage ?? ''
  return {
    type: 'element',
    tagName: 'pre',
    properties: {},
    children: [{
      type: 'element',
      tagName: 'code',
      properties: { className: language ? [`language-${language}`] : [] },
      children: [{ type: 'text', value: source }],
    }],
  }
}

function clean(node: ElementContent, url: URL): ElementContent[] {
  if (node.type !== 'element')
    return [node]

  const classes = node.properties.className
  if (Array.isArray(classes) && classes.includes('md-ignore'))
    return []

  if (node.properties?.dataPreviewLibrary) {
    const pre = select('[data-code-content] pre', node)
    if (!pre)
      throw new Error(`No rendered example source found in ${url}`)
    return [sourceBlock(pre)]
  }

  if (Array.isArray(classes) && classes.includes('expressive-code'))
    return selectAll('pre', node).map(sourceBlock)

  if (node.tagName === 'pre')
    return [sourceBlock(node)]

  if (['script', 'style', 'svg', 'button'].includes(node.tagName))
    return []

  if (node.tagName === 'h3') {
    // The HTML uses a CSS margin before element names like `<div>`.
    // Markdown needs an actual space there.
    node.children = node.children.flatMap<ElementContent>(child =>
      child.type === 'element' && child.tagName === 'span'
        ? [{ type: 'text', value: ' ' }, child]
        : [child],
    )
  }

  node.children = node.children.flatMap(child => clean(child, url))

  // These wrappers only arrange the web page. Keep their headings, prose,
  // source blocks, and API tables in normal Markdown document order.
  if (['div', 'section', 'main'].includes(node.tagName))
    return node.children

  if (node.tagName === 'a' && typeof node.properties.href === 'string')
    node.properties.href = new URL(node.properties.href, url).href

  return [node]
}

export function htmlToMarkdown(html: string, url: string | URL): string {
  const pageUrl = new URL(url)
  // Adapted from the pipeline in Cloudflare's historical docs utility:
  // https://github.com/cloudflare/cloudflare-docs/blob/c0382a6bf6e6d0cf095a8cdac375b0c339c4ae87/src/util/markdown.ts
  const tree = fromHtml(html)
  const main = select('#main-content', tree)
  if (!main)
    throw new Error(`No documentation content found in ${pageUrl}`)

  const title = textContent(select('title', tree)).trim()
  const description = select('meta[name="description"]', tree)?.properties?.content ?? ''
  const content: Root = { type: 'root', children: main.children.flatMap(child => clean(child, pageUrl)) }
  const markdown = toMarkdown(toMdast(content, { document: true }), {
    fences: true,
    extensions: [gfmToMarkdown({ tablePipeAlign: false })],
  })

  return `---\n${stringify({ title, description })}---\n\n${markdown}`
}
