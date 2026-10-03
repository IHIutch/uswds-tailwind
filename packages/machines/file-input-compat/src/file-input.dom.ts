import type { Scope } from '@zag-js/core'

export const getRootId = (ctx: Scope) => ctx.ids?.root ?? `file-input:${ctx.id}`
export const getLabelId = (ctx: Scope) => ctx.ids?.label ?? `file-input:${ctx.id}:label`
export const getDropzoneId = (ctx: Scope) => ctx.ids?.dropzone ?? `file-input:${ctx.id}:dropzone`
export const getBoxId = (ctx: Scope) => ctx.ids?.box ?? `file-input:${ctx.id}:box`
export const getInputId = (ctx: Scope) => ctx.ids?.input ?? `file-input:${ctx.id}:input`
export const getInstructionsId = (ctx: Scope) => ctx.ids?.instructions ?? `file-input:${ctx.id}:instructions`
export const getPreviewListId = (ctx: Scope) => ctx.ids?.previewList ?? `file-input:${ctx.id}:preview-list`
export const getPreviewHeadingId = (ctx: Scope) => ctx.ids?.previewHeading ?? `file-input:${ctx.id}:preview-heading`
export const getSrStatusId = (ctx: Scope) => ctx.ids?.srStatus ?? `file-input:${ctx.id}:sr-status`
export const getErrorTextId = (ctx: Scope) => ctx.ids?.errorText ?? `file-input:${ctx.id}:error`

// Object identity keeps equal-metadata files distinct without retaining them.
const fileIdentities = new WeakMap<File, string>()
let nextFileIdentity = 1

export function getFileIdentity(file: File) {
  let identity = fileIdentities.get(file)
  if (!identity) {
    identity = `file-${nextFileIdentity++}`
    fileIdentities.set(file, identity)
  }
  return identity
}

export const getItemId = (ctx: Scope, file: File) => `file-input:${ctx.id}:item:${getFileIdentity(file)}`
export function getItemPreviewImageId(ctx: Scope, file: File) {
  return `file-input:${ctx.id}:item-image:${getFileIdentity(file)}`
}

export const getInputEl = (ctx: Scope) => ctx.getById<HTMLInputElement>(getInputId(ctx))

/** Attach listeners to inputs that mount late or replace an existing input. */
export function observeInputMount(scope: Scope, onInputChange: (input: HTMLInputElement | null) => void): () => void {
  let previous: HTMLInputElement | null = null
  const notify = () => {
    const input = getInputEl(scope)
    if (input === previous)
      return
    previous = input
    onInputChange(input)
  }
  notify()

  // Capture discovers inputs inserted before MutationObserver delivery. Attach the
  // listener here, but process rejection at the target before parent listeners run.
  const root = scope.getRootNode()
  const discoverEventTarget = (event: Event) => {
    if (event.target === getInputEl(scope))
      notify()
  }
  root.addEventListener('change', discoverEventTarget, true)
  const observer = new (scope.getWin().MutationObserver)(notify)
  observer.observe(root, { childList: true, subtree: true, attributes: true, attributeFilter: ['id'] })
  return () => {
    root.removeEventListener('change', discoverEventTarget, true)
    observer.disconnect()
  }
}
