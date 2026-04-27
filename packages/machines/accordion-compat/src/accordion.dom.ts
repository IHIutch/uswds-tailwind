import type { Scope } from '@zag-js/core'
import { queryAll } from '@zag-js/dom-query'

// ACCORDION = `.usa-accordion, .usa-accordion--bordered`
// BUTTON = `.usa-accordion__button[aria-controls]:not(.usa-banner__button)`

export const getRootId = (ctx: Scope) => ctx.ids?.root ?? `accordion:${ctx.id}`
export const getItemId = (ctx: Scope, value: string) => ctx.ids?.item?.(value) ?? `accordion:${ctx.id}:item:${value}`
export function getItemContentId(ctx: Scope, value: string) {
  return ctx.ids?.itemContent?.(value) ?? `accordion:${ctx.id}:content:${value}`
}
export function getItemTriggerId(ctx: Scope, value: string) {
  return ctx.ids?.itemTrigger?.(value) ?? `accordion:${ctx.id}:trigger:${value}`
}

export const getRootEl = (ctx: Scope) => ctx.getById(getRootId(ctx))

// Uses data-ownedby to filter to direct children, mirroring the
export function getTriggerEls(ctx: Scope) {
  const ownerId = CSS.escape(getRootId(ctx))
  const selector = `[data-controls][data-ownedby='${ownerId}']`
  return queryAll(getRootEl(ctx), selector)
}
