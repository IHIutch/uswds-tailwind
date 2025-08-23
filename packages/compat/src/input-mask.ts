import * as inputMask from '@uswds-tailwind/input-mask-compat'
import { nanoid } from 'nanoid'
import { normalizeProps } from './lib//normalize-props'
import { Component } from './lib/component'
import { VanillaMachine } from './lib/machine'
import { spreadProps } from './lib/spread-props'

export class InputMask extends Component<inputMask.Props, inputMask.Api> {
  initMachine(props: inputMask.Props): VanillaMachine<inputMask.InputMaskSchema> {
    const inputEl = this.input

    return new VanillaMachine(inputMask.machine, {
      ...props,
      pattern: inputEl.getAttribute('pattern') || undefined,
      placeholder: inputEl.getAttribute('placeholder') || undefined,
      charset: inputEl.getAttribute('data-charset') || undefined,
    })
  }

  initApi() {
    return inputMask.connect(this.machine.service, normalizeProps)
  }

  render() {
    spreadProps(this.rootEl, this.api.getRootProps())
    this.renderInput(this.input)
    this.renderPlaceholder()
  }

  private get input() {
    const inputEl = this.rootEl.querySelector<HTMLInputElement>(
      `[data-part="input-mask-input"]`,
    )
    if (!inputEl)
      throw new Error('Expected inputEl to be defined')
    return inputEl
  }

  private get placeholder() {
    return this.rootEl.querySelector<HTMLElement>(
      `[data-part="placeholder"]`,
    )
  }

  private renderInput(inputEl: HTMLElement) {
    spreadProps(inputEl, this.api.getInputProps())
  }

  private renderPlaceholder() {
    const placeholderEl = this.placeholder
    if (placeholderEl) {
      placeholderEl.textContent = this.api.getDynamicPlaceholder()
      const spaceSaver = placeholderEl.querySelector('[data-part="input-mask"]')

      if (spaceSaver) {
        spaceSaver.textContent = this.api.getValue()
      }
      else {
        const spanEl = document.createElement('span')
        spanEl.textContent = this.api.getValue()
        spanEl.style.visibility = 'hidden'
        spanEl.setAttribute('data-part', 'input-mask')

        placeholderEl.insertBefore(spanEl, placeholderEl.firstChild)
      }
    }
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
