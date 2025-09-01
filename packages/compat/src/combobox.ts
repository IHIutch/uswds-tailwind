import type { ComboboxOption, ComboboxSchema } from '@uswds-tailwind/combobox-compat'
import * as combobox from '@uswds-tailwind/combobox-compat'
import { nanoid } from 'nanoid'
import { Component } from './lib/component'
import { VanillaMachine } from './lib/machine'
import { normalizeProps } from './lib/normalize-props'
import { spreadProps } from './lib/spread-props'

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
  static instances: Map<string, Combobox> = new Map()

  static getInstance(id: string) {
    return Combobox.instances.get(id)
  }

  initMachine(context: combobox.Props): VanillaMachine<ComboboxSchema> {
    Combobox.instances.set(context.id, this)

    const selectEl = this.rootEl.querySelector<HTMLSelectElement>('select')
    if (!selectEl)
      throw new Error('Expected selectEl to be defined')
    const optionEls = selectEl?.querySelectorAll<HTMLOptionElement>('option')
    if (!optionEls || optionEls.length === 0)
      throw new Error('Expected options to be defined')

    const options = Array.from(optionEls)
      .filter(optionEl => optionEl.value !== '')
      .map(optionEl => ({
        value: optionEl.value,
        label: optionEl.textContent || optionEl.value,
      }))

    const defaultValue = this.rootEl.getAttribute('data-default-value')
    const initialValue = defaultValue || selectEl.value || ''

    return new VanillaMachine(combobox.machine, {
      ...context,
      options,
      value: initialValue,
      placeholder: this.rootEl.getAttribute('data-placeholder') || '',
      disabled: this.rootEl.hasAttribute('data-disabled') || this.rootEl.hasAttribute('disabled')
        || (selectEl?.hasAttribute('disabled') ?? false),
      disableFiltering: this.rootEl.hasAttribute('data-disable-filtering'),
      showClearButton: this.clearButton !== null,
      showToggleButton: this.toggleButton !== null,
      onInputChange: (_value: string) => {
        const inputEl = this.rootEl.querySelector<HTMLInputElement>('[data-part="combobox-input"]')
        if (inputEl) {
          inputEl.dispatchEvent(new Event('change', { bubbles: true }))
        }
      },
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
    if (this.clearButton) {
      this.renderClearButton(this.clearButton)
    }
    if (this.toggleButton) {
      this.renderToggleButton(this.toggleButton)
    }
  }

  private get label() {
    return this.rootEl.querySelector<HTMLElement>(`[data-part="combobox-label"]`)
  }

  private get select() {
    const selectEl = this.rootEl.querySelector<HTMLSelectElement>(`[data-part="combobox-select"]`)
    if (!selectEl)
      throw new Error('Expected selectEl to be defined')
    return selectEl
  }

  private get input() {
    const inputEl = this.rootEl.querySelector<HTMLInputElement>(`[data-part="combobox-input"]`)
    if (!inputEl)
      throw new Error('Expected inputEl to be defined')
    return inputEl
  }

  private get list() {
    const listEl = this.rootEl.querySelector<HTMLElement>(`[data-part="combobox-list"]`)
    if (!listEl)
      throw new Error('Expected listEl to be defined')
    return listEl
  }

  private get clearButton() {
    return this.rootEl.querySelector<HTMLButtonElement>(`[data-part="combobox-clear"]`)
  }

  private get toggleButton() {
    return this.rootEl.querySelector<HTMLButtonElement>(`[data-part="combobox-toggle"]`)
  }

  private renderLabel(labelEl: HTMLElement) {
    spreadProps(labelEl, this.api.getLabelProps())
  }

  private renderInput(inputEl: HTMLInputElement) {
    const inputProps = this.api.getInputProps()
    spreadProps(inputEl, inputProps)
  }

  private renderSelect(selectEl: HTMLSelectElement) {
    spreadProps(selectEl, this.api.getSelectProps())

    const machineValue = this.api.value || ''
    const selectValue = selectEl.value || ''

    if (machineValue && selectValue !== machineValue) {
      selectEl.value = machineValue
    }
  }

  private renderList(listEl: HTMLElement) {
    spreadProps(listEl, this.api.getListProps())
  }

  private renderItems() {
    const filteredOptions = this.api.filteredOptions

    const templateItem = this.list.querySelector<HTMLElement>('[data-part="combobox-item"]')
    this.list.textContent = ''

    if (filteredOptions.length === 0 && this.api.inputValue.length > 0) {
      const itemEl = document.createElement('li')
      itemEl.setAttribute('data-part', 'combobox-item')
      if (templateItem) {
        copyAttributes(templateItem, itemEl)
      }
      itemEl.textContent = 'No results found'
      this.list.appendChild(itemEl)
    }
    else {
      filteredOptions.forEach((option: ComboboxOption, index: number) => {
        const itemEl = document.createElement('li')
        itemEl.setAttribute('data-part', 'combobox-item')
        itemEl.setAttribute('data-value', option.value)

        if (templateItem) {
          copyAttributes(templateItem, itemEl)
        }

        itemEl.textContent = option.label

        const itemProps = this.api.getItemProps(option, index)
        spreadProps(itemEl, itemProps)

        if (!itemEl.hasAttribute('tabindex')) {
          itemEl.setAttribute('tabindex', itemProps.tabIndex?.toString() || '0')
        }

        this.list.appendChild(itemEl)
      })
    }
  }

  private renderClearButton(buttonEl: HTMLButtonElement) {
    spreadProps(buttonEl, this.api.getClearButtonProps())
  }

  private renderToggleButton(buttonEl: HTMLButtonElement) {
    spreadProps(buttonEl, this.api.getToggleButtonProps())
  }
}

export function comboboxInit() {
  document.querySelectorAll<HTMLElement>('[data-part="combobox-root"]').forEach((targetEl) => {
    const selectEl = targetEl.querySelector<HTMLSelectElement>('[data-part="combobox-select"]')

    const combobox = new Combobox(targetEl, {
      id: targetEl.id || nanoid(),
      placeholder: targetEl.getAttribute('data-placeholder') || '',
      disabled: targetEl.hasAttribute('data-disabled') || targetEl.hasAttribute('disabled')
        || (selectEl?.hasAttribute('disabled') ?? false),
      disableFiltering: targetEl.hasAttribute('data-disable-filtering'),
      onInputChange: (_value: string) => {
        const inputEl = targetEl.querySelector<HTMLInputElement>('[data-part="combobox-input"]')
        if (inputEl) {
          inputEl.dispatchEvent(new Event('change', { bubbles: true }))
        }
      },
    })
    combobox.init()
  })
}

if (typeof window !== 'undefined') {
  window.Combobox = Combobox
  window.comboboxInit = comboboxInit
}
