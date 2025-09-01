import * as accordion from '@uswds-tailwind/accordion-compat'
import { nextTick } from '@zag-js/dom-query'
import { nanoid } from 'nanoid'
import { Component } from './lib/component'
import { VanillaMachine } from './lib/machine'
import { normalizeProps } from './lib/normalize-props'
import { spreadProps } from './lib/spread-props'

export class Accordion extends Component<accordion.Props, accordion.Api> {
  static instances = new Map<string, Accordion>()

  static getInstance(id: string) {
    return Accordion.instances.get(id)
  }

  initMachine(props: accordion.Props): VanillaMachine<accordion.AccordionSchema> {
    Accordion.instances.set(props.id, this)

    return new VanillaMachine(accordion.machine, {
      ...props,
      multiple: this.rootEl.hasAttribute('data-multiple'),
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
    return Array.from(
      this.rootEl.querySelectorAll<HTMLElement>('[data-part="accordion-item"]'),
    )
  }

  private renderItem(itemEl: HTMLElement) {
    const value = itemEl.dataset.value || itemEl.id
    if (!value)
      return
    spreadProps(itemEl, this.api.getItemProps({ value }))
    const trigger = itemEl.querySelector<HTMLElement>('[data-part="accordion-trigger"]')
    const content = itemEl.querySelector<HTMLElement>('[data-part="accordion-content"]')
    if (trigger)
      spreadProps(trigger, this.api.getTriggerProps({ value }))
    if (content)
      spreadProps(content, this.api.getContentProps({ value }))
  }

  async open(value: string) {
    this.api.open(value)
    await new Promise<void>(resolve => nextTick(resolve))
  }

  async close(value: string) {
    this.api.close(value)
    await new Promise<void>(resolve => nextTick(resolve))
  }

  async toggle(value: string) {
    this.api.toggle(value)
    await new Promise<void>(resolve => nextTick(resolve))
  }
}

export function accordionInit() {
  document.querySelectorAll<HTMLElement>('[data-part="accordion-root"]').forEach((targetEl) => {
    const accordion = new Accordion(targetEl, {
      id: targetEl.id || nanoid(),
    })
    accordion.init()
  })
}
