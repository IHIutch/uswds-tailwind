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
    const group = this.group
    if (group)
      spreadProps(group, this.api.getFormGroupProps())
    this.renderInput(this.input)
    const hint = this.hint
    if (hint)
      this.renderHint(hint)
    this.renderStatus(this.status)
    this.renderSrStatus(this.srStatus)
  }

  private get group() {
    return getPart<HTMLElement>(this.rootEl, parts.formGroup)
  }

  private get input() {
    const el = getPart<HTMLInputElement | HTMLTextAreaElement>(this.rootEl, parts.input)
    if (!el)
      throw new Error('Expected input element')
    return el
  }

  private get hint() {
    return getPart<HTMLElement>(this.rootEl, parts.hint)
  }

  private get status() {
    const el = getPart<HTMLElement>(this.rootEl, parts.visualStatus)
    if (!el)
      throw new Error('Expected visual-status element')
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

  private renderHint(hint: HTMLElement) {
    const { ref, ...props } = this.api.getHintProps()
    spreadProps(hint, props)
    ref?.(hint)
  }

  private renderStatus(status: HTMLElement) {
    spreadProps(status, this.api.getVisualStatusProps())
    status.textContent = this.api.maxLength ? this.api.statusText : ''
  }

  private renderSrStatus(status: HTMLElement) {
    spreadProps(status, this.api.getSrStatusProps())
    status.textContent = this.api.maxLength ? this.api.srStatusText : ''
  }
}

export function characterCountInit() {
  return CharacterCount.createAll(document)
}

if (typeof window !== 'undefined') {
  window.CharacterCount = CharacterCount
  window.characterCountInit = characterCountInit
}
