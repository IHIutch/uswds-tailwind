import { isLibrary, isLibraryDocumentation, LIBRARY_COOKIE, libraryFromPath, libraryHref } from './library'

function syncLibraryLinks() {
  const selected = document.documentElement.dataset.library
  if (!isLibrary(selected))
    return

  // Canonical paths are the source of truth; this also remembers legacy
  // ?library= links in browsers where script storage is available.
  if (libraryFromPath(location.pathname) || new URL(location.href).searchParams.get('library') === selected) {
    try {
      document.cookie = `${LIBRARY_COOKIE}=${selected}; Path=/; SameSite=Lax; Max-Age=31536000`
    }
    catch {
      // Path navigation still works when cookie storage is blocked.
    }
  }

  const current = new URL(location.href)
  for (const anchor of document.querySelectorAll<HTMLAnchorElement>('a[href]')) {
    if (anchor.hasAttribute('data-library-choice')) {
      const target = new URL(anchor.href)
      if (location.hash === '#main-content' || (target.pathname === location.pathname && location.hash))
        target.hash = location.hash
      anchor.href = target.href
      continue
    }
    if (anchor.target || anchor.hasAttribute('download'))
      continue
    const url = new URL(anchor.href)
    if (url.origin !== location.origin || /\.[^/]+$/.test(url.pathname))
      continue
    if (url.pathname === location.pathname && url.hash)
      continue

    if (isLibraryDocumentation(url.pathname) && !libraryFromPath(url.pathname)) {
      const explicit = url.searchParams.get('library')
      const targetLibrary = isLibrary(explicit) ? explicit : selected
      anchor.href = new URL(libraryHref(url.href, targetLibrary, current), current).href
      continue
    }

    for (const key of new Set(current.searchParams.keys())) {
      if (key !== 'library' && !url.searchParams.has(key))
        current.searchParams.getAll(key).forEach(value => url.searchParams.append(key, value))
    }
    anchor.href = url.href
  }
}

document.addEventListener('astro:page-load', syncLibraryLinks)
window.addEventListener('hashchange', syncLibraryLinks)
