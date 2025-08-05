import type { DropdownSchema } from '@uswds-tailwind/dropdown-compat'
import * as dropdown from '@uswds-tailwind/dropdown-compat'
import { Component } from './component'
import { VanillaMachine } from './lib/machine'
import { normalizeProps } from './normalize-props'
import { spreadProps } from './spread-props'

export class Dropdown extends Component<dropdown.Props, dropdown.Api> {
  initMachine(context: dropdown.Props): VanillaMachine<DropdownSchema> {
    return new VanillaMachine(dropdown.machine, { ...context })
  }

  initApi() {
    return dropdown.connect(this.machine.service, normalizeProps)
  }

  render() {
    spreadProps(this.rootEl, this.api.getRootProps())
    this.renderTrigger(this.trigger)
    this.renderContent(this.content)
    this.items.forEach((item) => this.renderItem(item))
  }

  private get trigger() {
    const el = this.rootEl.querySelector<HTMLElement>('[data-part="dropdown-trigger"]')
    if (!el) throw new Error('Expected trigger element to be defined')
    return el
  }

  private get content() {
    const el = this.rootEl.querySelector<HTMLElement>('[data-part="dropdown-content"]')
    if (!el) throw new Error('Expected content element to be defined')
    return el
  }

  private get items() {
    return Array.from(this.rootEl.querySelectorAll<HTMLElement>('[data-part="dropdown-item"]'))
  }

  private renderTrigger(el: HTMLElement) {
    spreadProps(el, this.api.getTriggerProps())
  }

  private renderContent(el: HTMLElement) {
    spreadProps(el, this.api.getContentProps())
  }

  private renderItem(el: HTMLElement) {
    spreadProps(el, this.api.getItemProps())
  }
}

export function dropdownInit() {
  document.querySelectorAll<HTMLElement>('[data-part="dropdown-root"]').forEach((targetEl) => {
    const dd = new Dropdown(targetEl, { id: targetEl.id || 'dropdown' })
    dd.init()
  })
}

if (typeof window !== 'undefined') {
  // @ts-ignore
  window.Dropdown = Dropdown
  // @ts-ignore
  window.dropdownInit = dropdownInit
}
