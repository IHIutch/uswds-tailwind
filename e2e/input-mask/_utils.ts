import type * as inputMask from '../../packages/machines/input-mask-compat/src'
import { InputMask, inputMaskInit } from '../../packages/compat/src/input-mask'
import { createDisposableComponent } from '../_utils'

export function INPUT_MASK(id: string, mask: string, attrs = '') {
  return `<span data-scope="input-mask" data-part="root" id="${id}">
    <span data-part="content"></span>
    <input data-part="input" name="${id}" placeholder="${mask}" ${attrs}>
  </span>`
}

export function createDisposableInputMask(id: string, markup: string, props?: inputMask.Props) {
  return createDisposableComponent(
    markup,
    () => props === undefined ? inputMaskInit() : [new InputMask(document.getElementById(id), props).init()],
    () => ({
      getRootEl: () => document.getElementById(`input-mask:${id}`)!,
      getContentEl: () => document.getElementById(`input-mask:${id}:content`)!,
      getInputEl: () => document.getElementById(`input-mask:${id}:input`) as HTMLInputElement,
      getInstance: () => InputMask.getInstance(document.getElementById(`input-mask:${id}`)),
    }),
  )
}
