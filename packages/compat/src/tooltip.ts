import * as tooltip from '@uswds-tailwind/tooltip-compat'
import { normalizeProps, spreadProps, VanillaMachine } from '@zag-js/vanilla'
import { Component } from './lib/component'
import { getId } from './lib/id-generator'

export class Tooltip extends Component<tooltip.Props, tooltip.Api> {
  static instances = new Map<string, Tooltip>()

  static getInstance(id: string) {
    return Tooltip.instances.get(id)
  }

  initMachine(props: tooltip.Props): VanillaMachine<tooltip.TooltipSchema> {
    Tooltip.instances.set(props.id, this)

    let placement = this.rootEl.getAttribute('data-placement') as tooltip.TooltipPlacement || undefined
    if (placement && !['top', 'bottom', 'left', 'right'].includes(placement)) {
      placement = 'top'
    }

    return new VanillaMachine(tooltip.machine, {
      ...props,
      placement,
      content: this.trigger.getAttribute('title') || '',
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
    const triggerEl = this.rootEl.querySelector<HTMLElement>('[data-part="tooltip-trigger"]')
    if (!triggerEl)
      throw new Error('Expected triggerEl to be defined')
    return triggerEl
  }

  private get content() {
    const contentEl = this.rootEl.querySelector<HTMLElement>('[data-part="tooltip-content"]')
    if (!contentEl)
      throw new Error('Expected contentEl to be defined')
    return contentEl
  }

  private renderTrigger(triggerEl: HTMLElement) {
    spreadProps(triggerEl, this.api.getTriggerProps())
  }

  private renderContent(contentEl: HTMLElement) {
    spreadProps(contentEl, this.api.getContentProps())
    contentEl.textContent = this.api.getContent()
  }
}

export function tooltipInit() {
  document.querySelectorAll<HTMLElement>('[data-part="tooltip-root"]').forEach((targetEl) => {
    const tooltip = new Tooltip(targetEl, {
      id: targetEl.id || getId(targetEl, 'tooltip'),
    })
    tooltip.init()
  })
}
