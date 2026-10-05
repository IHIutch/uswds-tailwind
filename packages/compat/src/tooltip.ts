import * as tooltip from '@uswds-tailwind/tooltip-compat'
import { normalizeProps, spreadProps, VanillaMachine } from '@zag-js/vanilla'
import { Component } from './lib/component'
import { getDataEnum } from './lib/data-attr'
import { getPart } from './lib/dom'
import { getId } from './lib/id-generator'

const { trigger, content } = tooltip.anatomy.build()

const PLACEMENTS = ['top', 'bottom', 'left', 'right'] as const

export class Tooltip extends Component<tooltip.Props, tooltip.Api> {
  static override root = tooltip.anatomy.build().root

  initMachine(props: tooltip.Props): VanillaMachine<tooltip.Schema> {
    const placement = props.placement ?? getDataEnum(this.rootEl, 'placement', PLACEMENTS)
      ?? (this.rootEl.hasAttribute('data-placement') ? 'top' : undefined)

    return new VanillaMachine(tooltip.machine, {
      ...props,
      id: props.id || this.rootEl.id || getId(this.rootEl, 'tooltip'),
      placement,
    })
  }

  initApi() {
    return tooltip.connect(this.machine.service, normalizeProps)
  }

  render() {
    spreadProps(this.rootEl, this.api.getRootProps())
    this.renderTrigger(this.trigger)
    this.renderContent(this.content)
  }

  private get trigger() {
    const triggerEl = getPart<HTMLElement>(this.rootEl, trigger)
    if (!triggerEl)
      throw new Error('Expected triggerEl to be defined')
    return triggerEl
  }

  private get content() {
    const contentEl = getPart<HTMLElement>(this.rootEl, content)
    if (!contentEl)
      throw new Error('Expected contentEl to be defined')
    return contentEl
  }

  private renderTrigger(triggerEl: HTMLElement) {
    const title = triggerEl.getAttribute('title')
    if (title !== null) {
      this.content.textContent = title
      triggerEl.removeAttribute('title')
    }
    spreadProps(triggerEl, this.api.getTriggerProps())
  }

  private renderContent(contentEl: HTMLElement) {
    spreadProps(contentEl, this.api.getContentProps())
  }
}

export function tooltipInit() {
  return Tooltip.createAll(document)
}
