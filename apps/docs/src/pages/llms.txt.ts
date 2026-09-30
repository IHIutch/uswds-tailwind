import type { APIRoute } from 'astro'
import { getCollection, getEntry } from 'astro:content'
import dedent from 'dedent'

export const prerender = true

export const GET: APIRoute = async () => {
  const siteUrl = import.meta.env.SITE

  const gettingStarted = await getEntry('pages', 'getting-started')
  const about = await getEntry('pages', 'about')
  const javascript = await getEntry('pages', 'javascript')
  const typography = await getEntry('pages', 'typography')

  const components = await getCollection(
    'components',
    entry => entry.data.isPublished !== false,
  )

  return new Response(dedent(`
# USWDS + Tailwind Documentation

Build federal websites and applications faster than ever.

## Overview

- [Getting Started](${siteUrl}/${gettingStarted?.id}.md)
- [About](${siteUrl}/${about?.id}.md)
- [JavaScript](${siteUrl}/${javascript?.id}.md)
- [Typography](${siteUrl}/${typography?.id}.md)

${['vanilla', 'react'].map(library => `## ${library === 'react' ? 'React' : 'Vanilla'} components

${components.map(c => `- [${c.data.title} (${library === 'react' ? 'React' : 'Vanilla'})](${siteUrl}/docs/${library}/components/${c.id}.md): ${c.data.description}`).join('\n')}`).join('\n\n')}

`), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  })
}
