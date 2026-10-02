import type { Scope } from '@zag-js/core'
import { isInView } from '@zag-js/dom-query'

/* -----------------------------------------------------------------------------
 * Ids + element getters
 * ----------------------------------------------------------------------------- */

export const getRootId = (ctx: Scope) => ctx.ids?.root ?? `accordion:${ctx.id}`
export const getItemTriggerId = (ctx: Scope, value: string) => ctx.ids?.itemTrigger?.(value) ?? `accordion:${ctx.id}:trigger:${value}`
export const getItemContentId = (ctx: Scope, value: string) => ctx.ids?.itemContent?.(value) ?? `accordion:${ctx.id}:content:${value}`

const getItemTriggerEl = (ctx: Scope, value: string) => ctx.getById(getItemTriggerId(ctx, value))

export function scrollIntoView(scope: Scope, value: string) {
  const trigger = getItemTriggerEl(scope, value)
  if (trigger?.isConnected && !isInView(trigger, scope.getWin())) {
    trigger.scrollIntoView()
  }
}
