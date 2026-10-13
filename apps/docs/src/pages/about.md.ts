import type { APIRoute } from 'astro'
import { getPageLinks } from '#utils/metadata'
import { getEntry } from 'astro:content'
import dedent from 'dedent'

export const prerender = false

export const GET: APIRoute = async ({ site, url }) => {
  const post = await getEntry('pages', 'about')
  if (!post) {
    throw new Error('Page not found')
  }

  return new Response(dedent(`
---
title: ${post.data.title}
description: ${post.data.description}
---

${post.body}
`), {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Link': getPageLinks('/about', site ?? url).markdownHeader,
    },
  })
}
