import type { APIRoute } from 'astro'
import { htmlToMarkdown } from '#utils/html-to-markdown'
import { getPageLinks } from '#utils/metadata'

export const GET: APIRoute = async ({ request, url, rewrite, site }) => {
  const htmlUrl = new URL(url)
  htmlUrl.pathname = htmlUrl.pathname.slice(0, -3)
  const headers = new Headers(request.headers)
  // Render the selected page without triggering its Markdown redirect.
  headers.set('Accept', 'text/html')
  const response = await rewrite(new Request(htmlUrl, { headers }))
  const responseHeaders = new Headers(response.headers)
  responseHeaders.set('Content-Type', 'text/markdown; charset=utf-8')
  responseHeaders.delete('Content-Length')
  if (response.status !== 200) {
    return new Response(response.status === 404 ? '# Page not found\n' : '# Unable to load documentation\n', {
      status: response.status,
      headers: responseHeaders,
    })
  }
  const markdown = htmlToMarkdown(await response.text(), htmlUrl)
  responseHeaders.set('Link', getPageLinks(htmlUrl.pathname, site ?? url).markdownHeader)
  return new Response(markdown, { headers: responseHeaders })
}
