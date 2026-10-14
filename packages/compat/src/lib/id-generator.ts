/**
 * Generates stable IDs for component root elements
 * Uses WeakMap for automatic garbage collection when elements are removed
 */

// One counter per component type (prefix)
const counters = new Map<string, number>()
// Memo: element -> id (GC-friendly)
const ids = new WeakMap<Element, string>()

/**
 * Get a stable ID for a root element.
 * Memoized, so re-init ignores the prefixed id the machine wrote to the element.
 *
 * @param element - The component root element.
 * @param prefix - Component name, e.g. "accordion" or "modal".
 * @returns The authored id, or e.g. "accordion-1"
 */
export function getId(element: Element, prefix: string) {
  let id = ids.get(element)
  if (id)
    return id

  if (element.id) {
    id = element.id
  }
  else {
    const next = (counters.get(prefix) || 0) + 1
    counters.set(prefix, next)
    id = `${prefix}-${next}`
  }
  ids.set(element, id)
  return id
}
