import type { APIRoute } from 'astro'
import { getCollection, getEntry } from 'astro:content'
import dedent from 'dedent'

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

## Components

${components.map((c) => {
  const line = `- [${c.data.title}](${siteUrl}/components/${c.id}.md)`
  if (c.data.description) {
    return line.concat(`: ${c.data.description}`)
  }
  return line
}).join('\n')}
`), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  })
}
