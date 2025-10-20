import type { AstroGlobal } from 'astro'

export function prefersMarkdown(Astro: AstroGlobal) {
  const acceptHeader = Astro.request.headers.get('accept')
  return acceptHeader?.includes('text/plain')
    || acceptHeader?.includes('text/markdown')
}
