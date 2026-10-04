import * as dropdown from '@uswds-tailwind/dropdown-compat'
import { normalizeProps, spreadProps, VanillaMachine } from '@zag-js/vanilla'
import { Component } from './lib/component'
import { getDataString } from './lib/data-attr'
import { getOwnedElements, getOwnedPart, getOwnedParts } from './lib/dom'
import { getId } from './lib/id-generator'

const parts = dropdown.anatomy.build()

export type VanillaDropdownProps = Omit<dropdown.Props, 'open' | 'defaultOpen' | 'onOpenChange'>

export class Dropdown extends Component<VanillaDropdownProps, dropdown.Api> {
  static override root = parts.root

  initMachine(props: VanillaDropdownProps): VanillaMachine<dropdown.DropdownSchema> {
    return new VanillaMachine(dropdown.machine, {
      id: props.id || this.rootEl.id || getId(this.rootEl, 'dropdown'),
      ids: props.ids,
      getRootNode: props.getRootNode,
      onItemSelect: props.onItemSelect,
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
    const el = getOwnedPart<HTMLElement>(this.rootEl, parts.trigger)
    if (!el)
      throw new Error('Expected trigger element to be defined')
    return el
  }

  private get content() {
    const el = getOwnedPart<HTMLElement>(this.rootEl, parts.content)
    if (!el)
      throw new Error('Expected content element to be defined')
    return el
  }

  private get items() {
    return getOwnedParts<HTMLElement>(this.rootEl, parts.item)
  }

  private renderTrigger(el: HTMLElement) {
    spreadProps(el, this.api.getTriggerProps())
  }

  private renderContent(el: HTMLElement) {
    spreadProps(el, this.api.getContentProps())
  }

  private renderItem(el: HTMLElement) {
    const value = getDataString(el, 'value') || el.id || undefined
    spreadProps(el, this.api.getItemProps({ value }))
    getOwnedElements<HTMLAnchorElement>(this.rootEl, el, 'a')
      .forEach(link => spreadProps(link, this.api.getItemLinkProps({ value })))
  }

  async open() {
    this.api.setOpen(true)
    await this.settle()
  }

  async close() {
    this.api.setOpen(false)
    await this.settle()
  }
}

export function dropdownInit() {
  return Dropdown.createAll(document)
}
