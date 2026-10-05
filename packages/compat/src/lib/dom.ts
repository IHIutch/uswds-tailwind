import type { AnatomyPart } from '@zag-js/anatomy'
import { query, queryAll } from '@zag-js/dom-query'

export function getPart<T extends Element = Element>(root: Element, part: AnatomyPart) {
  return query<T>(root, `[data-part="${part.attrs['data-part']}"]`)
}

export function getParts<T extends Element = Element>(root: Element, part: AnatomyPart) {
  return queryAll<T>(root, `[data-part="${part.attrs['data-part']}"]`)
}

export function getRoots<T extends Element = Element>(scope: Document | Element, root: AnatomyPart) {
  return queryAll<T>(scope, `[data-scope="${root.attrs['data-scope']}"][data-part="${root.attrs['data-part']}"]`)
}

/** Queries descendants owned by this root, excluding nested roots of the same anatomy. */
export function getOwnedElements<T extends Element = Element>(root: Element, scope: Element, selector: string) {
  const elements = queryAll<T>(scope, selector)
  const rootScope = root.getAttribute('data-scope')
  const rootPart = root.getAttribute('data-part')
  if (!rootScope || !rootPart)
    return elements

  const rootSelector = `[data-scope="${rootScope}"][data-part="${rootPart}"]`
  return elements.filter(element => element.parentElement?.closest(rootSelector) === root)
}

export function getOwnedPart<T extends Element = Element>(root: Element, part: AnatomyPart) {
  return getOwnedParts<T>(root, part)[0] ?? null
}

export function getOwnedParts<T extends Element = Element>(root: Element, part: AnatomyPart) {
  return getOwnedElements<T>(root, root, `[data-part="${part.attrs['data-part']}"]`)
}
