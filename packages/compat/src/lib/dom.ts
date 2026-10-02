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
