import type { APIRoute } from 'astro'
import { htmlToMarkdown } from '#utils/html-to-markdown.mjs'

export const GET: APIRoute = async ({ request, url, rewrite }) => {
  const htmlUrl = new URL(url)
  htmlUrl.pathname = htmlUrl.pathname.slice(0, -3)
  // Existing /components/*.md URLs represent Vanilla documentation.
  if (htmlUrl.pathname.startsWith('/components/'))
    htmlUrl.pathname = `/docs/vanilla${htmlUrl.pathname}`
  const headers = new Headers(request.headers)
  // Render HTML without triggering the page's Markdown redirect.
  headers.set('Accept', 'text/html')
  const response = await rewrite(new Request(htmlUrl, { headers }))
  if (response.status !== 200)
    return response
  const markdown = htmlToMarkdown(await response.text(), htmlUrl)
  response.headers.set('Content-Type', 'text/markdown; charset=utf-8')
  response.headers.delete('Content-Length')
  return new Response(markdown, { headers: response.headers })
}
