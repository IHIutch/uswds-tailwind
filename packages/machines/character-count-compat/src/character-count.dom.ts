import type { Scope } from '@zag-js/core'

export const SR_STATUS_DEBOUNCE_MS = 1200
export const AT_DEFER_MS = 100

export const getRootId = (ctx: Scope) => ctx.ids?.root ?? `character-count:${ctx.id}`
export const getFormGroupId = (ctx: Scope) => ctx.ids?.formGroup ?? `character-count:${ctx.id}:form-group`
export const getInputId = (ctx: Scope) => ctx.ids?.input ?? `character-count:${ctx.id}:input`
export const getHintId = (ctx: Scope) => ctx.ids?.hint ?? `character-count:${ctx.id}:hint`
export const getVisualStatusId = (ctx: Scope) => ctx.ids?.visualStatus ?? `character-count:${ctx.id}:visual-status`
export const getSrStatusId = (ctx: Scope) => ctx.ids?.srStatus ?? `character-count:${ctx.id}:sr-status`

export const getInputEl = (ctx: Scope) => ctx.getById<HTMLInputElement | HTMLTextAreaElement>(getInputId(ctx))

const ownedValidityMessages = new WeakMap<HTMLInputElement | HTMLTextAreaElement, string>()

/** Update only this counter's custom validity, preserving other validators' errors. */
export function applyOwnedValidity(
  el: HTMLInputElement | HTMLTextAreaElement,
  over: boolean,
  errorText: string,
) {
  const ownedMessage = ownedValidityMessages.get(el)
  const currentMessage = el.validationMessage

  if (over) {
    if (ownedMessage && currentMessage === ownedMessage) {
      if (ownedMessage !== errorText) {
        el.setCustomValidity(errorText)
        ownedValidityMessages.set(el, errorText)
      }
    }
    else if (!currentMessage) {
      el.setCustomValidity(errorText)
      ownedValidityMessages.set(el, errorText)
    }
    else {
      ownedValidityMessages.delete(el)
    }
    return
  }

  if (ownedMessage && currentMessage === ownedMessage)
    el.setCustomValidity('')
  ownedValidityMessages.delete(el)
}

// Counters in one document share an announcement timer.
interface PendingSrAnnouncement {
  owner: object
  timer: ReturnType<Window['setTimeout']>
}

const pendingAnnouncements = new WeakMap<Document, PendingSrAnnouncement>()

export function scheduleSrAnnouncement(
  doc: Document,
  win: Window,
  owner: object,
  commit: () => void,
  delay = SR_STATUS_DEBOUNCE_MS,
) {
  const previous = pendingAnnouncements.get(doc)
  if (previous)
    win.clearTimeout(previous.timer)

  const pending: PendingSrAnnouncement = {
    owner,
    timer: win.setTimeout(() => {
      if (pendingAnnouncements.get(doc) !== pending)
        return
      pendingAnnouncements.delete(doc)
      commit()
    }, delay),
  }
  pendingAnnouncements.set(doc, pending)
}

/** Teardown cancels only this counter's pending announcement. */
export function cancelSrAnnouncement(doc: Document, win: Window, owner: object) {
  const pending = pendingAnnouncements.get(doc)
  if (!pending || pending.owner !== owner)
    return
  win.clearTimeout(pending.timer)
  pendingAnnouncements.delete(doc)
}
