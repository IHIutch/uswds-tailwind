import type { AstroGlobal } from 'astro'

/** Match the Markdown media type, ignoring parameters. */
export function prefersMarkdown(Astro: AstroGlobal) {
  return (Astro.request.headers.get('accept') ?? '')
    .split(',')
    .some(type => type.split(';')[0].trim().toLowerCase() === 'text/markdown')
}
