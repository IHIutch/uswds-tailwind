import * as inputMask from '@uswds-tailwind/input-mask-compat'
import { nanoid } from 'nanoid'
import { normalizeProps } from './lib//normalize-props'
import { Component } from './lib/component'
import { VanillaMachine } from './lib/machine'
import { spreadProps } from './lib/spread-props'

export class InputMask extends Component<inputMask.Props, inputMask.Api> {
  initMachine(props: inputMask.Props): VanillaMachine<inputMask.InputMaskSchema> {
    const mask = this.rootEl.getAttribute('data-mask')
    const regex = this.rootEl.getAttribute('data-regex')

    return new VanillaMachine(inputMask.machine, {
      ...props,
      mask: mask || undefined,
      regex: regex || undefined,
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
    if (!inputEl)
      throw new Error('Expected inputEl to be defined')
    return inputEl
  }

  private renderInput(inputEl: HTMLElement) {
    spreadProps(inputEl, this.api.getInputProps())
  }
}

export function inputMaskInit() {
  document.querySelectorAll<HTMLElement>('[data-part="input-mask-root"]').forEach((targetEl) => {
    const inputMask = new InputMask(targetEl, {
      id: targetEl.id || nanoid(),
    })
    inputMask.init()
  })
}
