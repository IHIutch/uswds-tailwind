import * as collapse from '@uswds-tailwind/collapse-compat'
import { normalizeProps, spreadProps, VanillaMachine } from '@zag-js/vanilla'
import { Component } from './lib/component'
import { getDataString } from './lib/data-attr'
import { getParts } from './lib/dom'
import { getId } from './lib/id-generator'

const parts = collapse.anatomy.build()
const rootSelector = `[data-scope="${parts.root.attrs['data-scope']}"][data-part="${parts.root.attrs['data-part']}"]`

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
    const indicator = getParts<HTMLElement>(this.rootEl, parts.indicator)
      .find(element => element.closest(rootSelector) === this.rootEl)
    if (indicator)
      spreadProps(indicator, this.api.getIndicatorProps())
  }

  private get trigger() {
    return this.getOwnedPart(parts.trigger)
  }

  private get content() {
    const contentEl = this.getOwnedPart(parts.content)
    if (!contentEl)
      throw new Error('Expected contentEl to be defined')
    return contentEl
  }

  private getOwnedPart(part: typeof parts.trigger | typeof parts.content) {
    return getParts<HTMLElement>(this.rootEl, part)
      .find(element => element.closest(rootSelector) === this.rootEl)
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
