import type { Library } from '#content/component-coverage'

export const LIBRARY_COOKIE = 'docs-library'

export function privateRedirect(response: Response): Response {
  response.headers.set('Cache-Control', 'private, no-store')
  return response
}

export function isLibrary(value: unknown): value is Library {
  return value === 'vanilla' || value === 'react'
}

export function libraryFromPath(pathname: string): Library | undefined {
  const match = /^\/docs\/(vanilla|react)(?:\/|$)/.exec(pathname)
    ?? /^\/components\/(vanilla|react)(?:\/|$)/.exec(pathname)
  return match?.[1] as Library | undefined
}

/** Canonical docs paths win over legacy query links and saved preferences. */
export function resolveLibrary(url: URL, remembered?: string): Library {
  const fromPath = libraryFromPath(url.pathname)
  if (fromPath)
    return fromPath
  const fromQuery = url.searchParams.get('library')
  if (isLibrary(fromQuery))
    return fromQuery
  return isLibrary(remembered) ? remembered : 'vanilla'
}

export function isLibraryDocumentation(pathname: string): boolean {
  return /^(?:\/docs\/(?:vanilla|react))?\/(?:components(?:\/|$)|getting-started\/?$|javascript\/?$)/.test(pathname)
}

export function docsPath(pathname: string, library: Library): string {
  const suffix = pathname.replace(/^\/docs\/(?:vanilla|react)(?=\/|$)/, '')
    .replace(/^\/components\/(?:vanilla|react)(?=\/|$)/, '/components')
  if (!isLibraryDocumentation(suffix))
    throw new Error(`Not a library documentation path: ${pathname}`)
  return `/docs/${library}${suffix}`
}

/** Internal links keep unrelated parameters; library-specific links use paths. */
export function libraryHref(href: string, library: Library, currentUrl?: URL): string {
  const url = new URL(href, currentUrl ?? 'https://docs.invalid')
  if (isLibraryDocumentation(url.pathname))
    url.pathname = docsPath(url.pathname, library)

  for (const key of new Set(currentUrl?.searchParams.keys() ?? [])) {
    if (key !== 'library' && !url.searchParams.has(key))
      currentUrl?.searchParams.getAll(key).forEach(value => url.searchParams.append(key, value))
  }
  url.searchParams.delete('library')
  return `${url.pathname}${url.search}${url.hash}`
}

/** On shared pages, choosing a library enters its setup route. */
export function switchLibraryHref(currentUrl: URL, library: Library): string {
  const target = isLibraryDocumentation(currentUrl.pathname)
    ? currentUrl.pathname
    : '/getting-started'
  return libraryHref(`${target}${currentUrl.search}`, library, currentUrl)
}
