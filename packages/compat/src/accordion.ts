import * as accordion from '@uswds-tailwind/accordion-compat'
import { normalizeProps, spreadProps, VanillaMachine } from '@zag-js/vanilla'
import { Component } from './lib/component'
import { getDataBool, getDataString } from './lib/data-attr'
import { getPart, getParts } from './lib/dom'
import { getId } from './lib/id-generator'

const parts = accordion.anatomy.build()
const rootSelector = `[data-scope="${parts.root.attrs['data-scope']}"][data-part="${parts.root.attrs['data-part']}"]`

export class Accordion extends Component<accordion.Props, accordion.Api> {
  static override root = parts.root

  initMachine(props: accordion.Props): VanillaMachine<accordion.Schema> {
    const multiple = getDataBool(this.rootEl, 'multiple')
    const authoredValue = this.items
      .filter(item => getDataString(item, 'state') === 'open')
      .map(item => this.getItemValue(item))
      .filter(value => typeof value === 'string')

    return new VanillaMachine(accordion.machine, {
      ...props,
      id: props.id || this.rootEl.id || getId(this.rootEl, 'accordion'),
      multiple,
      defaultValue: props.defaultValue ?? (multiple ? authoredValue : authoredValue.slice(0, 1)),
    })
  }

  initApi() {
    return accordion.connect(this.machine.service, normalizeProps)
  }

  render() {
    spreadProps(this.rootEl, this.api.getRootProps())
    this.items.forEach(item => this.renderItem(item))
  }

  private get items() {
    return getParts<HTMLElement>(this.rootEl, parts.item)
      // Prevent nested accordions from being assigned to the parent
      .filter(item => item.closest(rootSelector) === this.rootEl)
  }

  private getItemValue(itemEl: HTMLElement) {
    return getDataString(itemEl, 'value') || itemEl.id || undefined
  }

  private renderItem(itemEl: HTMLElement) {
    const value = this.getItemValue(itemEl)
    if (!value)
      return
    spreadProps(itemEl, this.api.getItemProps({ value }))
    const trigger = getPart<HTMLElement>(itemEl, parts.itemTrigger)
    const content = getPart<HTMLElement>(itemEl, parts.itemContent)
    if (trigger)
      spreadProps(trigger, this.api.getItemTriggerProps({ value }))
    if (content)
      spreadProps(content, this.api.getItemContentProps({ value }))
  }

  async open(value: string) {
    this.api.show(value)
    await this.settle()
  }

  async close(value: string) {
    this.api.hide(value)
    await this.settle()
  }

  async toggle(value: string) {
    this.api.toggle(value)
    await this.settle()
  }
}

export function accordionInit() {
  return Accordion.createAll(document)
}
