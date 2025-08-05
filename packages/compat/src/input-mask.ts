import type { InputMaskSchema } from '@uswds-tailwind/input-mask-compat'
import * as inputMask from '@uswds-tailwind/input-mask-compat'
import { Component } from './component'
import { VanillaMachine } from './lib/machine'
import { normalizeProps } from './normalize-props'
import { spreadProps } from './spread-props'

export class InputMask extends Component<inputMask.Props, inputMask.Api> {
  initMachine(context: inputMask.Props): VanillaMachine<InputMaskSchema> {
    return new VanillaMachine(inputMask.machine, {
      ...context,
    })
  }

  initApi() {
    return inputMask.connect(this.machine.service, normalizeProps)
  }

  render() {
    spreadProps(this.rootEl, this.api.getRootProps())
    this.renderInput(this.input)
  }

  private get input() {
    const inputEl = this.rootEl.querySelector<HTMLInputElement>(
      `[data-part="input-mask-input"]`,
    )
    if (!inputEl) throw new Error('Expected inputEl to be defined')
    return inputEl
  }

  private renderInput(inputEl: HTMLElement) {
    spreadProps(inputEl, this.api.getInputProps())
  }
}

export function inputMaskInit() {
  document.querySelectorAll<HTMLElement>('[data-part="input-mask-root"]').forEach((targetEl) => {
    const mask = targetEl.getAttribute('data-mask') || ''
    const regex = targetEl.getAttribute('data-regex') || undefined
    const im = new InputMask(targetEl, {
      id: targetEl.id || 'input-mask',
      mask,
      regex: regex || undefined,
    })
    im.init()
  })
}

if (typeof window !== 'undefined') {
  // @ts-ignore
  window.InputMask = InputMask
  // @ts-ignore
  window.inputMaskInit = inputMaskInit
}
