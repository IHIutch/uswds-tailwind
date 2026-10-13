import { defineMiddleware } from 'astro:middleware'

// Preserve existing public links and indexed URLs when V2 replaces the main site.
// These pages documented Vanilla, so their permanent destinations stay Vanilla.
export const onRequest = defineMiddleware(({ url, redirect }, next) => {
  if (/^\/(?:components(?:\/|$)|getting-started(?:\/|$)|javascript(?:\/|$))/.test(url.pathname)) {
    return redirect(`/docs/vanilla${url.pathname.replace(/\/$/, '')}${url.search}`, 301)
  }
  return next()
})
