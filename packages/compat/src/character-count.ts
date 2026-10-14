import * as characterCount from '@uswds-tailwind/character-count-compat'
import { normalizeProps, spreadProps, VanillaMachine } from '@zag-js/vanilla'
import { Component } from './lib/component'
import { getPart } from './lib/dom'
import { getId } from './lib/id-generator'

const parts = characterCount.anatomy.build()

function mergeIds(...values: Array<string | null | undefined>) {
  const ids = values.flatMap(value => value?.trim().split(/\s+/) ?? [])
  return [...new Set(ids)].join(' ') || undefined
}

export class CharacterCount extends Component<characterCount.Props, characterCount.Api> {
  static override root = parts.root

  initMachine(props: characterCount.Props): VanillaMachine<characterCount.Schema> {
    const input = this.input
    const label = this.label
    const description = this.description
    const maxLength = input.getAttribute('maxlength') ?? this.rootEl.getAttribute('data-maxlength')
    const descriptionId = description
      ? props.ids?.description ?? (description.id || getId(description, 'character-count-description'))
      : props.ids?.description

    return new VanillaMachine(characterCount.machine, {
      ...props,
      id: props.id || this.rootEl.id || getId(this.rootEl, 'character-count'),
      ids: {
        ...props.ids,
        input: props.ids?.input ?? (input.id || undefined),
        label: props.ids?.label ?? (label?.id || undefined),
        description: descriptionId,
      },
      maxLength: props.maxLength ?? (maxLength === null ? 0 : Number(maxLength)),
      defaultValue: props.defaultValue ?? input.value,
      inputDescriptionIds: mergeIds(
        props.inputDescriptionIds ?? input.getAttribute('aria-describedby'),
        description ? descriptionId : undefined,
      ),
    })
  }

  initApi() {
    return characterCount.connect(this.machine.service, normalizeProps)
  }

  render() {
    spreadProps(this.rootEl, this.api.getRootProps())
    const label = this.label
    if (label)
      spreadProps(label, this.api.getLabelProps())
    const control = this.control
    if (control)
      spreadProps(control, this.api.getControlProps())
    this.renderInput(this.input)
    const description = this.description
    if (description)
      spreadProps(description, this.api.getDescriptionProps())
    this.renderStatus(this.status)
    this.renderSrStatus(this.srStatus)
  }

  private get label() {
    return getPart<HTMLLabelElement>(this.rootEl, parts.label)
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
