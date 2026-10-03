export function getDataString(el: Element, key: string) {
  const v = el.getAttribute(`data-${key}`)
  return v == null ? undefined : v
}

/**
 * Reads a boolean `data-*` attribute.
 * The following rules are applied:
 * - Bare attribute (e.g. `data-multiple`), `true`
 * - Explicit "false", `false`
 * - Any other value, `true`
 */
export function getDataBool(el: Element, key: string) {
  if (!el.hasAttribute(`data-${key}`))
    return false
  const v = el.getAttribute(`data-${key}`)
  if (v === 'false')
    return false
  return true
}

export function getDataEnum<T extends string>(
  el: Element,
  key: string,
  values: readonly T[],
) {
  const v = el.getAttribute(`data-${key}`)
  if (v != null && (values as readonly string[]).includes(v))
    return v as T
  return undefined
}
