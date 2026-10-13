export type Library = 'vanilla' | 'react'

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
  return match?.[1] as Library | undefined
}

/** Explicit docs paths take precedence over the saved preference. */
export function resolveLibrary(url: URL, remembered?: string): Library {
  const fromPath = libraryFromPath(url.pathname)
  if (fromPath)
    return fromPath
  return isLibrary(remembered) ? remembered : 'vanilla'
}

/** On shared pages, choosing a library enters its setup route. */
export function switchLibraryHref(currentUrl: URL, library: Library): string {
  const suffix = libraryFromPath(currentUrl.pathname)
    ? currentUrl.pathname.replace(/^\/docs\/(?:vanilla|react)/, '')
    : '/getting-started'
  return `/docs/${library}${suffix}${currentUrl.search}`
}
