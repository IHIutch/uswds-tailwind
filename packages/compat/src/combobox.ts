import type { Schema as ComboboxSchema } from '@uswds-tailwind/combobox-compat'
import * as combobox from '@uswds-tailwind/combobox-compat'
import { normalizeProps, spreadProps, VanillaMachine } from '@zag-js/vanilla'
import { Component } from './lib/component'
import { getDataBool, getDataString } from './lib/data-attr'
import { getPart } from './lib/dom'
import { getId } from './lib/id-generator'

const parts = combobox.anatomy.build()

function copyAttributes(from: HTMLElement, to: HTMLElement) {
  const className = from.getAttribute('class')
  const style = from.getAttribute('style')

  if (className) {
    to.setAttribute('class', className)
  }

  if (style) {
    to.setAttribute('style', style)
  }
}

export class Combobox extends Component<combobox.Props, combobox.Api> {
  static override root = parts.root

  private itemTemplate: HTMLElement | null = null

  initMachine(props: combobox.Props): VanillaMachine<ComboboxSchema> {
    const select = this.select
    const optionEls = select.querySelectorAll<HTMLOptionElement>('option')
    if (optionEls.length === 0)
      throw new Error('Expected options to be defined')

    const options = Array.from(optionEls)
      .filter(optionEl => optionEl.value !== '')
      .map(optionEl => ({
        value: optionEl.value,
        label: optionEl.textContent || optionEl.value,
      }))

    const filterExtras = Object.fromEntries(
      Array.from(this.rootEl.attributes)
        .filter(attribute => attribute.name.startsWith('data-filter-'))
        .map(attribute => [
          attribute.name.slice('data-filter-'.length).replace(/-([a-z])/g, (_, letter: string) => letter.toUpperCase()),
          attribute.value,
        ]),
    )

    return new VanillaMachine(combobox.machine, {
      ...props,
      'id': props.id || this.rootEl.id || getId(this.rootEl, 'combobox'),
      'ids': { ...props.ids, hiddenSelect: props.ids?.hiddenSelect ?? (select.id || undefined) },
      'aria-label': props['aria-label'] ?? select.getAttribute('aria-label') ?? undefined,
      'aria-labelledby': props['aria-labelledby'] ?? select.getAttribute('aria-labelledby') ?? undefined,
      'options': props.options ?? options,
      'defaultValue': props.defaultValue ?? getDataString(this.rootEl, 'default-value') ?? select.value,
      'filter': props.filter ?? getDataString(this.rootEl, 'filter'),
      // Explicit captures override USWDS's dataset fallback; props override both.
      'filterExtras': props.filterExtras ?? { ...this.rootEl.dataset, ...filterExtras } as Record<string, string>,
      'placeholder': props.placeholder ?? getDataString(this.rootEl, 'placeholder') ?? '',
      'disabled': props.disabled ?? (getDataBool(this.rootEl, 'disabled') || select.hasAttribute('disabled')),
      'ariaDisabled': props.ariaDisabled ?? select.hasAttribute('aria-disabled'),
      'disableFiltering': props.disableFiltering ?? getDataBool(this.rootEl, 'disable-filtering'),
    })
  }

  initApi() {
    return combobox.connect(this.machine.service, normalizeProps)
  }

  render() {
    spreadProps(this.rootEl, this.api.getRootProps())

    if (this.label) {
      this.renderLabel(this.label)
    }
    this.renderInput(this.input)
    this.renderSelect(this.select)
    this.renderList(this.list)
    this.renderItems()
    const statusEl = getPart<HTMLElement>(this.rootEl, parts.status)
    if (statusEl) {
      spreadProps(statusEl, this.api.getStatusProps())
      statusEl.textContent = this.api.srStatusText
    }
    if (this.clearButton) {
      this.renderClearButton(this.clearButton)
    }
    if (this.toggleButton) {
      this.renderToggleButton(this.toggleButton)
    }
  }

  private get label() {
    return getPart<HTMLElement>(this.rootEl, parts.label)
  }

  private get select() {
    const selectEl = getPart<HTMLSelectElement>(this.rootEl, parts.hiddenSelect)
    if (!selectEl)
      throw new Error('Expected selectEl to be defined')
    return selectEl
  }

  private get input() {
    const inputEl = getPart<HTMLInputElement>(this.rootEl, parts.input)
    if (!inputEl)
      throw new Error('Expected inputEl to be defined')
    return inputEl
  }

  private get list() {
    const listEl = getPart<HTMLElement>(this.rootEl, parts.list)
    if (!listEl)
      throw new Error('Expected listEl to be defined')
    return listEl
  }

  private get clearButton() {
    return getPart<HTMLButtonElement>(this.rootEl, parts.clearTrigger)
  }

  private get toggleButton() {
    return getPart<HTMLButtonElement>(this.rootEl, parts.trigger)
  }

  private renderLabel(labelEl: HTMLElement) {
    spreadProps(labelEl, this.api.getLabelProps())
  }

  private renderInput(inputEl: HTMLInputElement) {
    spreadProps(inputEl, this.api.getInputProps())
  }

  private renderSelect(selectEl: HTMLSelectElement) {
    spreadProps(selectEl, this.api.getHiddenSelectProps())
  }

  private renderList(listEl: HTMLElement) {
    spreadProps(listEl, this.api.getListProps())
  }

  private renderItems() {
    const items = this.api.items
    this.itemTemplate ??= getPart<HTMLElement>(this.list, parts.item)
    const templateItem = this.itemTemplate
    const currentItems = Array.from(this.list.querySelectorAll<HTMLElement>('[role="option"]'))
    const sameItems = currentItems.length === items.length
      && currentItems.every((item, index) => {
        const next = items[index]!
        return item.id === next.id
          && item.getAttribute('data-value') === next.value
          && item.textContent === next.label
      })

    if (!sameItems || (items.length === 0 && !this.api.inputValue))
      this.list.textContent = ''

    if (items.length === 0 && this.api.inputValue.length > 0) {
      if (!this.list.firstElementChild) {
        const itemEl = document.createElement('li')
        itemEl.setAttribute('data-part', parts.item.attrs['data-part']!)
        if (templateItem)
          copyAttributes(templateItem, itemEl)
        itemEl.textContent = 'No results found'
        this.list.appendChild(itemEl)
      }
    }
    else {
      items.forEach((item, index) => {
        const itemEl = sameItems ? currentItems[index]! : document.createElement('li')
        if (!sameItems) {
          if (templateItem)
            copyAttributes(templateItem, itemEl)

          itemEl.textContent = item.label
        }

        spreadProps(itemEl, this.api.getItemProps({ item }))

        if (!sameItems)
          this.list.appendChild(itemEl)
      })
    }
  }

  private renderClearButton(buttonEl: HTMLButtonElement) {
    spreadProps(buttonEl, this.api.getClearTriggerProps())
  }

  private renderToggleButton(buttonEl: HTMLButtonElement) {
    spreadProps(buttonEl, this.api.getTriggerProps())
  }

  async enable() {
    this.machine.updateProps({ disabled: false })
    await this.settle()
  }

  async disable() {
    this.machine.updateProps({ disabled: true })
    await this.settle()
  }
}

export function comboboxInit() {
  return Combobox.createAll(document)
}

if (typeof window !== 'undefined') {
  window.Combobox = Combobox
  window.comboboxInit = comboboxInit
}
