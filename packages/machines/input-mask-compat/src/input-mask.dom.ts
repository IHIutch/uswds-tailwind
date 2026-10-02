import type { Scope } from '@zag-js/core'

export const getRootId = (ctx: Scope) => ctx.ids?.root ?? `input-mask:${ctx.id}`
export const getContentId = (ctx: Scope) => ctx.ids?.content ?? `input-mask:${ctx.id}:content`
export const getInputId = (ctx: Scope) => ctx.ids?.input ?? `input-mask:${ctx.id}:input`

export function setInputValue(scope: Scope, value: string) {
  const input = scope.getById<HTMLInputElement>(getInputId(scope))
  if (input)
    input.value = value
}
