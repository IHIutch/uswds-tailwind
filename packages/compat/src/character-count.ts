import * as characterCount from '@uswds-tailwind/character-count-compat'
import { normalizeProps, spreadProps, VanillaMachine } from '@zag-js/vanilla'
import { Component } from './lib/component'
import { getPart } from './lib/dom'
import { getId } from './lib/id-generator'

const parts = characterCount.anatomy.build()

export class CharacterCount extends Component<characterCount.Props, characterCount.Api> {
  static override root = parts.root

  initMachine(props: characterCount.Props): VanillaMachine<characterCount.Schema> {
    const input = this.input
    const maxLength = input.getAttribute('maxlength')

    return new VanillaMachine(characterCount.machine, {
      ...props,
      id: props.id || this.rootEl.id || getId(this.rootEl, 'character-count'),
      ids: { ...props.ids, input: props.ids?.input ?? (input.id || undefined) },
      maxLength: props.maxLength ?? (maxLength === null ? 0 : Number(maxLength)),
      defaultValue: props.defaultValue ?? input.value,
    })
  }

  initApi() {
    return characterCount.connect(this.machine.service, normalizeProps)
  }

  render() {
    spreadProps(this.rootEl, this.api.getRootProps())
    const control = this.control
    if (control)
      spreadProps(control, this.api.getControlProps())
    this.renderInput(this.input)
    const description = this.description
    if (description)
      this.renderDescription(description)
    this.renderStatus(this.status)
    this.renderSrStatus(this.srStatus)
  }

  private get control() {
    return getPart<HTMLElement>(this.rootEl, parts.control)
  }

  private get input() {
    const el = getPart<HTMLInputElement | HTMLTextAreaElement>(this.rootEl, parts.input)
    if (!el)
      throw new Error('Expected input element')
    return el
  }

  private get description() {
    return getPart<HTMLElement>(this.rootEl, parts.description)
  }

  private get status() {
    const el = getPart<HTMLElement>(this.rootEl, parts.status)
    if (!el)
      throw new Error('Expected status element')
    return el
  }

  private get srStatus() {
    const el = getPart<HTMLElement>(this.rootEl, parts.srStatus)
    if (!el)
      throw new Error('Expected sr-status element')
    return el
  }

  private renderInput(input: HTMLInputElement | HTMLTextAreaElement) {
    const { ref, ...props } = this.api.getInputProps()
    spreadProps(input, props)
    ref?.(input)
  }

  private renderDescription(description: HTMLElement) {
    const { ref, ...props } = this.api.getDescriptionProps()
    spreadProps(description, props)
    ref?.(description)
  }

  private renderStatus(el: HTMLElement) {
    spreadProps(el, this.api.getStatusProps())
    el.textContent = this.api.statusText
  }

  private renderSrStatus(status: HTMLElement) {
    spreadProps(status, this.api.getSrStatusProps())
    const text = this.api.maxLength ? this.api.srStatusText : ''
    if (status.textContent !== text)
      status.textContent = text
  }
}

export function characterCountInit() {
  return CharacterCount.createAll(document)
}

if (typeof window !== 'undefined') {
  window.CharacterCount = CharacterCount
  window.characterCountInit = characterCountInit
}
