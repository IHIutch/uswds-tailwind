import type { Scope } from '@zag-js/core'

export const SR_STATUS_DEBOUNCE_MS = 1200
export const AT_DEFER_MS = 100

export const getRootId = (scope: Scope) => scope.ids?.root ?? `character-count:${scope.id}`
export const getControlId = (scope: Scope) => scope.ids?.control ?? `character-count:${scope.id}:control`
export const getInputId = (scope: Scope) => scope.ids?.input ?? `character-count:${scope.id}:input`
export const getDescriptionId = (scope: Scope) => scope.ids?.description ?? `character-count:${scope.id}:description`
export const getStatusId = (scope: Scope) => scope.ids?.status ?? `character-count:${scope.id}:status`
export const getSrStatusId = (scope: Scope) => scope.ids?.srStatus ?? `character-count:${scope.id}:sr-status`

export const getInputEl = (scope: Scope) => scope.getById<HTMLInputElement | HTMLTextAreaElement>(getInputId(scope))

export function setInputValue(scope: Scope, value: string) {
  const input = getInputEl(scope)
  if (input && input.value !== value)
    input.value = value
}

const ownedValidityMessages = new WeakMap<HTMLInputElement | HTMLTextAreaElement, string>()
const validitySyncTimers = new WeakMap<HTMLInputElement | HTMLTextAreaElement, VoidFunction>()

export function cancelValiditySync(el: HTMLInputElement | HTMLTextAreaElement) {
  validitySyncTimers.get(el)?.()
  validitySyncTimers.delete(el)
}

/** Update only this counter's custom validity, preserving other validators' errors. */
export function applyOwnedValidity(
  el: HTMLInputElement | HTMLTextAreaElement,
  over: boolean,
  validationMessage: string,
) {
  const ownedMessage = ownedValidityMessages.get(el)
  const currentMessage = el.validationMessage

  if (currentMessage && currentMessage !== ownedMessage) {
    cancelValiditySync(el)
    ownedValidityMessages.delete(el)
    return
  }

  // Let Safari VoiceOver finish character echo before clearing invalidity.
  if (!over && ownedMessage && currentMessage === ownedMessage) {
    if (!validitySyncTimers.has(el)) {
      const win = el.ownerDocument.defaultView!
      const timer = win.setTimeout(() => {
        validitySyncTimers.delete(el)
        if (el.validationMessage === ownedMessage)
          el.setCustomValidity('')
        ownedValidityMessages.delete(el)
      }, AT_DEFER_MS)
      validitySyncTimers.set(el, () => win.clearTimeout(timer))
    }
    return
  }

  cancelValiditySync(el)
  const nextMessage = over ? validationMessage : ''
  if (currentMessage !== nextMessage)
    el.setCustomValidity(nextMessage)
  if (over)
    ownedValidityMessages.set(el, validationMessage)
  else
    ownedValidityMessages.delete(el)
}

// Counters in one document share an announcement timer.
const pendingAnnouncements = new WeakMap<Document, VoidFunction>()

export function scheduleSrAnnouncement(scope: Scope, commit: VoidFunction, delay: number) {
  const doc = scope.getDoc()
  const win = scope.getWin()
  pendingAnnouncements.get(doc)?.()

  const timer = win.setTimeout(() => {
    pendingAnnouncements.delete(doc)
    commit()
  }, delay)

  const cleanup = () => {
    win.clearTimeout(timer)
    if (pendingAnnouncements.get(doc) === cleanup)
      pendingAnnouncements.delete(doc)
  }
  pendingAnnouncements.set(doc, cleanup)
  return cleanup
}
