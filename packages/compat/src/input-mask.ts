import * as inputMask from '@uswds-tailwind/input-mask-compat'
import { normalizeProps, spreadProps, VanillaMachine } from '@zag-js/vanilla'
import { Component } from './lib/component'
import { getDataString } from './lib/data-attr'
import { getPart } from './lib/dom'
import { getId } from './lib/id-generator'

const parts = inputMask.anatomy.build()

export class InputMask extends Component<inputMask.Props, inputMask.Api> {
  static override root = parts.root

  initMachine(props: inputMask.Props): VanillaMachine<inputMask.Schema> {
    return new VanillaMachine(inputMask.machine, {
      ...props,
      id: props.id || this.rootEl.id || getId(this.rootEl, 'input-mask'),
      mask: props.mask ?? this.input.getAttribute('placeholder') ?? '',
      charset: props.charset ?? getDataString(this.input, 'charset'),
      defaultValue: props.defaultValue ?? this.input.value,
    })
  }

  initApi() {
    return inputMask.connect(this.machine.service, normalizeProps)
  }

  render() {
    spreadProps(this.rootEl, this.api.getRootProps())
    spreadProps(this.input, this.api.getInputProps())
    this.input.removeAttribute('placeholder')
    const content = this.content
    spreadProps(content, this.api.getContentProps())
    const typed = document.createElement('i')
    typed.textContent = this.api.overlayValue
    content.replaceChildren(typed, document.createTextNode(this.api.remainingPlaceholder))
  }

  private get input() {
    const element = getPart<HTMLInputElement>(this.rootEl, parts.input)
    if (!element)
      throw new Error('Expected input element')
    return element
  }

  private get content() {
    const element = getPart<HTMLElement>(this.rootEl, parts.content)
    if (!element)
      throw new Error('Expected content element')
    return element
  }
}

export function inputMaskInit() {
  return InputMask.createAll(document)
}
