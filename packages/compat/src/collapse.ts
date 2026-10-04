import * as collapse from '@uswds-tailwind/collapse-compat'
import { normalizeProps, spreadProps, VanillaMachine } from '@zag-js/vanilla'
import { Component } from './lib/component'
import { getDataString } from './lib/data-attr'
import { getOwnedPart } from './lib/dom'
import { getId } from './lib/id-generator'

const parts = collapse.anatomy.build()

export class Collapse extends Component<collapse.Props, collapse.Api> {
  static override root = parts.root

  initMachine(props: collapse.Props): VanillaMachine<collapse.CollapseSchema> {
    return new VanillaMachine(collapse.machine, {
      ...props,
      id: props.id || this.rootEl.id || getId(this.rootEl, 'collapse'),
      defaultOpen: props.defaultOpen ?? getDataString(this.rootEl, 'state') === 'open',
    })
  }

  initApi() {
    return collapse.connect(this.machine.service, normalizeProps)
  }

  render() {
    spreadProps(this.rootEl, this.api.getRootProps())

    if (this.trigger) {
      this.renderTrigger(this.trigger)
    }
    this.renderContent(this.content)
    const indicator = getOwnedPart<HTMLElement>(this.rootEl, parts.indicator)
    if (indicator)
      spreadProps(indicator, this.api.getIndicatorProps())
  }

  private get trigger() {
    return getOwnedPart<HTMLElement>(this.rootEl, parts.trigger)
  }

  private get content() {
    const contentEl = getOwnedPart<HTMLElement>(this.rootEl, parts.content)
    if (!contentEl)
      throw new Error('Expected contentEl to be defined')
    return contentEl
  }

  private renderTrigger(triggerEl: HTMLElement) {
    spreadProps(triggerEl, this.api.getTriggerProps())
  }

  private renderContent(contentEl: HTMLElement) {
    spreadProps(contentEl, this.api.getContentProps())
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

export function collapseInit() {
  return Collapse.createAll(document)
}
