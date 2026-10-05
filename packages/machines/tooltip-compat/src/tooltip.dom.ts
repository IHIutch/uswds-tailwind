import type { Scope } from '@zag-js/core'
import { getEventTarget } from '@zag-js/dom-query'

export const getRootId = (ctx: Scope) => ctx.ids?.root ?? `tooltip:${ctx.id}`
export const getTriggerId = (ctx: Scope) => ctx.ids?.trigger ?? `tooltip:${ctx.id}:trigger`
export const getContentId = (ctx: Scope) => ctx.ids?.content ?? `tooltip:${ctx.id}:content`

export const getTriggerEl = (ctx: Scope) => ctx.getById<HTMLElement>(getTriggerId(ctx))
export const getContentEl = (ctx: Scope) => ctx.getById<HTMLElement>(getContentId(ctx))

const TRIGGER_SELECTOR = '[data-scope="tooltip"][data-part="trigger"]'

export function isOwnTriggerEvent(event: { target: EventTarget | null, currentTarget: EventTarget | null }): boolean {
  const target = getEventTarget<HTMLElement>(event)
  return !!target && target.closest(TRIGGER_SELECTOR) === event.currentTarget
}
