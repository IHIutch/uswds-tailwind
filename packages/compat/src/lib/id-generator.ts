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
 * @param prefix - Component name, e.g. "accordion" or "modal".
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
