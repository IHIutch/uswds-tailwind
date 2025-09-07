import * as collapse from '@uswds-tailwind/collapse-compat'
import { nanoid } from 'nanoid'
import { Component } from './lib/component'
import { VanillaMachine } from './lib/machine'
import { normalizeProps } from './lib/normalize-props'
import { spreadProps } from './lib/spread-props'

export class Collapse extends Component<collapse.Props, collapse.Api> {
  static instances = new Map<string, Collapse>()

  static getInstance(id: string) {
    return Collapse.instances.get(id)
  }

  initMachine(props: collapse.Props): VanillaMachine<collapse.CollapseSchema> {
    Collapse.instances.set(props.id, this)

    return new VanillaMachine(collapse.machine, {
      ...props,
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
  }

  private get trigger() {
    return this.rootEl.querySelector<HTMLElement>(`[data-part="collapse-trigger"]`)
  }

  private get content() {
    const contentEl = this.rootEl.querySelector<HTMLElement>(`[data-part="collapse-content"]`)
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
}

export function collapseInit() {
  document.querySelectorAll<HTMLElement>('[data-part="collapse-root"]').forEach((targetEl) => {
    const collapse = new Collapse(targetEl, {
      id: targetEl.id || nanoid(),
    })
    collapse.init()
  })
}
