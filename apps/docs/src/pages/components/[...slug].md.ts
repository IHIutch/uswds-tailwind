import type { APIRoute } from 'astro'
import { getEntry } from 'astro:content'
import dedent from 'dedent'

export const prerender = false

export const GET: APIRoute = async ({ params }) => {
  if (!params.slug) {
    throw new Error('Page not found')
  }
  const post = await getEntry('components', params.slug)
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
    },
  })
}
