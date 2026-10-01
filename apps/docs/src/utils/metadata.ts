/** Canonical HTML and its Markdown representation share one URL policy. */
export function getPageLinks(pathname: string, site: URL) {
  const path = pathname.replace(/\.md$/, '').replace(/\/+$/, '').replace(/^\/components\/(vanilla|react)\//, '/docs/$1/components/') || '/'
  const canonical = new URL(path, site)
  return {
    canonical,
    markdown: new URL(`${path}.md`, site),
    markdownHeader: `<${canonical.href}>; rel="canonical", <${canonical.href}>; rel="alternate"; type="text/html"`,
  }
}
