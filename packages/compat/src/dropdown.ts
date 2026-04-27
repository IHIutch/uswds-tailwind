import * as dropdown from '@uswds-tailwind/dropdown-compat'
import { normalizeProps, spreadProps, VanillaMachine } from '@zag-js/vanilla'
import { Component } from './lib/component'
import { getId } from './lib/id-generator'

export class Dropdown extends Component<dropdown.Props, dropdown.Api> {
  static instances = new Map<string, Dropdown>()

  static getInstance(id: string) {
    return Dropdown.instances.get(id)
  }

  initMachine(props: dropdown.Props): VanillaMachine<dropdown.DropdownSchema> {
    Dropdown.instances.set(props.id, this)

    return new VanillaMachine(dropdown.machine, {
      ...props,
    })
  }

  initApi() {
    return dropdown.connect(this.machine.service, normalizeProps)
  }

  render() {
    spreadProps(this.rootEl, this.api.getRootProps())
    this.renderTrigger(this.trigger)
    this.renderContent(this.content)
    this.items.forEach(item => this.renderItem(item))
  }

  private get trigger() {
    const el = this.rootEl.querySelector<HTMLElement>('[data-part="dropdown-trigger"]')
    if (!el)
      throw new Error('Expected trigger element to be defined')
    return el
  }

  private get content() {
    const el = this.rootEl.querySelector<HTMLElement>('[data-part="dropdown-content"]')
    if (!el)
      throw new Error('Expected content element to be defined')
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
    const dropdown = new Dropdown(targetEl, {
      id: targetEl.id || getId(targetEl, 'dropdown'),
    })
    dropdown.init()
  })
}
