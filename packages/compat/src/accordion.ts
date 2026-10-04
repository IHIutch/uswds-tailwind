import * as accordion from '@uswds-tailwind/accordion-compat'
import { normalizeProps, spreadProps, VanillaMachine } from '@zag-js/vanilla'
import { Component } from './lib/component'
import { getDataBool, getDataString } from './lib/data-attr'
import { getOwnedElements, getOwnedParts } from './lib/dom'
import { getId } from './lib/id-generator'

const parts = accordion.anatomy.build()
const itemSelector = `[data-part="${parts.item.attrs['data-part']}"]`

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
    return getOwnedParts<HTMLElement>(this.rootEl, parts.item)
  }

  private getItemValue(itemEl: HTMLElement) {
    return getDataString(itemEl, 'value') || itemEl.id || undefined
  }

  private renderItem(itemEl: HTMLElement) {
    const value = this.getItemValue(itemEl)
    if (!value)
      return
    spreadProps(itemEl, this.api.getItemProps({ value }))
    // Root ownership excludes nested accordions; the closest item check also
    // excludes parts inside another item belonging to this accordion.
    const trigger = getOwnedElements<HTMLElement>(this.rootEl, itemEl, `[data-part="${parts.itemTrigger.attrs['data-part']}"]`)
      .find(element => element.closest(itemSelector) === itemEl)
    const content = getOwnedElements<HTMLElement>(this.rootEl, itemEl, `[data-part="${parts.itemContent.attrs['data-part']}"]`)
      .find(element => element.closest(itemSelector) === itemEl)
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
