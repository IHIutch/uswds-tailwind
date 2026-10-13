import type { DocSearchProps } from '@docsearch/react'

type TransformItems = NonNullable<DocSearchProps['transformItems']>

export function getSearchCategory(pathname: string): string {
  const parts = pathname.split('/')
  const section = parts[1] === 'docs' ? parts[2] : undefined
  return section
    ? section.charAt(0).toUpperCase() + section.slice(1)
    : 'Documentation'
}

export const transformSearchResults: TransformItems = (items) => {
  const seen = new Set<string>()

  return items.flatMap((item) => {
    const url = new URL(item.url)
    // Ignore navigation entries if an index includes them.
    if (url.hash === '#sidenav' || url.hash === '#mobile-docs-menu')
      return []

    const href = `${url.pathname}${url.search}${url.hash}`
    if (seen.has(href))
      return []
    seen.add(href)

    const group = getSearchCategory(url.pathname)

    return [{
      ...item,
      url: href,
      hierarchy: { ...item.hierarchy, lvl0: group },
      _highlightResult: {
        ...item._highlightResult,
        hierarchy: {
          ...item._highlightResult?.hierarchy,
          lvl0: { value: group, matchLevel: 'none', matchedWords: [] },
        },
      },
      _snippetResult: {
        ...item._snippetResult,
        hierarchy: {
          ...item._snippetResult?.hierarchy,
          lvl0: { value: group, matchLevel: 'none', matchedWords: [] },
        },
      },
    }]
  })
}
