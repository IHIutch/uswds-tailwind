import type { APIRoute } from 'astro'
import { getPageLinks } from '#utils/metadata'
import { getCollection } from 'astro:content'

export const prerender = true

export const GET: APIRoute = async ({ site }) => {
  if (!site)
    throw new Error('Astro site URL is required for sitemap generation')

  const components = await getCollection('vanilla-components')
  const reactComponents = await getCollection('react-components')
  const paths = [
    '/',
    '/about',
    '/colors',
    '/icons',
    '/typography',
    ...['vanilla', 'react'].flatMap(library => [
      `/docs/${library}/getting-started`,
      `/docs/${library}/javascript`,
      ...(library === 'react' ? reactComponents : components).map(entry => `/docs/${library}/components/${entry.id}`),
    ]),
  ]
  const urls = paths.map(path => getPageLinks(path, site).canonical.href).sort()

  return new Response(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `<url><loc>${url.replaceAll('&', '&amp;')}</loc></url>`).join('\n')}
</urlset>`, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  })
}
