/**
 * Generates unique, incremental IDs for component instances
 * Uses WeakMap for automatic garbage collection when instances are destroyed
 */

// One counter per component type (prefix)
const counters = new Map<string, number>()
// Memo: instance -> id (GC-friendly)
const ids = new WeakMap<object, string>()

/**
 * Get a stable, per-type unique ID for an instance.
 * IDs are never reused, even if instances are destroyed.
 *
 * @param instance - The component instance (any object).
 * @param prefix - Component type, e.g. "accordion" or "modal".
 * @returns e.g. "accordion-1", "modal-3"
 */
export function getId(instance: object, prefix: string) {
  let id = ids.get(instance)
  if (id)
    return id

  const next = (counters.get(prefix) || 0) + 1
  counters.set(prefix, next)
  id = `${prefix}-${next}`
  ids.set(instance, id)
  return id
}

/**
 * (Optional) Ensure a prefix starts at least at a given number.
 * Handy for SSR hydration or multi-bundle pages.
 */
export function ensurePrefixMin(prefix: string, min: number) {
  const cur = counters.get(prefix) || 0
  if (min > cur)
    counters.set(prefix, min)
}

/**
 * Resets all counters (useful for testing)
 */
export function resetIdGenerator() {
  counters.clear()
  // Note: WeakMap ids will be GC'd automatically, no need to clear
}

/**
 * Gets current counter for a prefix (useful for debugging)
 */
export function getCurrentCount(prefix: string) {
  return counters.get(prefix) || 0
}
