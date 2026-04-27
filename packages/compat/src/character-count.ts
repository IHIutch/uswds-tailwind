import * as characterCount from '@uswds-tailwind/character-count-compat'
import { normalizeProps, spreadProps, VanillaMachine } from '@zag-js/vanilla'
import { Component } from './lib/component'
import { getId } from './lib/id-generator'

export class CharacterCount extends Component<characterCount.Props, characterCount.Api> {
  static instances: Map<string, CharacterCount> = new Map()

  static getInstance(id: string) {
    return CharacterCount.instances.get(id)
  }

  initMachine(props: characterCount.Props): VanillaMachine<characterCount.CharacterCountSchema> {
    CharacterCount.instances.set(props.id, this)

    const maxLength = this.input?.getAttribute('maxlength')

    return new VanillaMachine(characterCount.machine, {
      ...props,
      maxLength: maxLength ? Number(maxLength) : undefined,
    })
  }

  initApi() {
    return characterCount.connect(this.machine.service, normalizeProps)
  }

  render() {
    spreadProps(this.rootEl, this.api.getRootProps())

    if (this.label) {
      this.renderLabel(this.label)
    }
    this.renderInput(this.input)
    this.renderStatus(this.status)
    this.renderSrStatus(this.srStatus)
  }

  private get label() {
    return this.rootEl.querySelector<HTMLElement>(`[data-part="character-count-label"]`)
  }

  private get input() {
    const inputEl = this.rootEl.querySelector<HTMLInputElement>(`[data-part="character-count-input"]`)
    if (!inputEl)
      throw new Error('Expected inputEl to be defined')
    return inputEl
  }

  private get status() {
    const statusEl = this.rootEl.querySelector<HTMLElement>(`[data-part="character-count-status"]`)
    if (!statusEl)
      throw new Error('Expected statusEl to be defined')
    return statusEl
  }

  private get srStatus() {
    const srStatusEl = this.rootEl.querySelector<HTMLElement>(`[data-part="character-count-sr-status"]`)
    if (!srStatusEl)
      throw new Error('Expected srStatusEl to be defined')
    return srStatusEl
  }

  private renderLabel(labelEl: HTMLElement) {
    spreadProps(labelEl, this.api.getLabelProps())
  }

  private renderInput(inputEl: HTMLElement) {
    spreadProps(inputEl, this.api.getInputProps())
  }

  private renderStatus(statusEl: HTMLElement) {
    spreadProps(statusEl, this.api.getStatusProps())
    statusEl.textContent = this.machine.context.get('statusText')
  }

  private renderSrStatus(srStatusEl: HTMLElement) {
    spreadProps(srStatusEl, this.api.getSrStatusProps())
    srStatusEl.textContent = this.machine.context.get('srStatusText')
  }

  setCustomValidity(message: string) {
    this.api.setCustomValidity(message)
  }
}

export function characterCountInit() {
  document.querySelectorAll<HTMLElement>('[data-part="character-count-root"]').forEach((targetEl) => {
    const characterCount = new CharacterCount(targetEl, {
      id: targetEl.id || getId(targetEl, 'character-count'),
    })
    characterCount.init()
  })
}

if (typeof window !== 'undefined') {
  window.CharacterCount = CharacterCount
  window.characterCountInit = characterCountInit
}
