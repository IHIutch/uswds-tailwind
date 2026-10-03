import * as modal from '@uswds-tailwind/modal-compat'
import { queryAll } from '@zag-js/dom-query'
import { normalizeProps, spreadProps, VanillaMachine } from '@zag-js/vanilla'
import { Component } from './lib/component'
import { getDataBool, getDataString } from './lib/data-attr'
import { getPart, getParts } from './lib/dom'
import { getId } from './lib/id-generator'

export class Modal extends Component<modal.Props, modal.Api> {
  static override root = modal.parts.root

  initMachine(props: modal.Props): VanillaMachine<modal.Schema> {
    // Move the modal to the end of the body
    this.doc.body.appendChild(this.rootEl)
    return new VanillaMachine(modal.machine, {
      ...props,
      'id': props.id || getDataString(this.rootEl, 'value') || this.rootEl.id || getId(this.rootEl, 'modal'),
      'defaultOpen': props.defaultOpen ?? getDataString(this.rootEl, 'state') === 'open',
      'forceAction': props.forceAction ?? getDataBool(this.rootEl, 'force-action'),
      'aria-label': props['aria-label'] ?? this.content.getAttribute('aria-label') ?? undefined,
    })
  }

  initApi() {
    return modal.connect(this.machine.service, normalizeProps)
  }

  render() {
    this.renderPositioner(this.positioner)
    this.triggers.forEach((triggerEl, index) => {
      this.renderTrigger(triggerEl, index)
    })
    this.renderBackdrop(this.backdrop)
    this.renderContent(this.content)

    this.closeTriggers.forEach((closeTriggerEl, index) => {
      this.renderCloseTrigger(closeTriggerEl, index)
    })

    const titleEl = getPart<HTMLElement>(this.content, modal.parts.title)
    if (titleEl)
      spreadProps(titleEl, this.api.getTitleProps())

    const descriptionEl = getPart<HTMLElement>(this.content, modal.parts.description)
    if (descriptionEl)
      spreadProps(descriptionEl, this.api.getDescriptionProps())
  }

  private get triggers() {
    if (!getDataString(this.rootEl, 'value'))
      throw new Error('Expected modal root to have a `data-value` attribute')
    return queryAll<HTMLElement>(this.doc, `[data-part="${modal.parts.trigger.attrs['data-part']}"][data-target="${getDataString(this.rootEl, 'value')}"]`)
  }

  private get backdrop() {
    const backdropEl = getPart<HTMLElement>(this.rootEl, modal.parts.backdrop)
    if (!backdropEl)
      throw new Error('Expected backdropEl to be defined')
    return backdropEl
  }

  private get positioner() {
    const positionerEl = getPart<HTMLElement>(this.rootEl, modal.parts.positioner)
    if (!positionerEl)
      throw new Error('Expected positionerEl to be defined')
    return positionerEl
  }

  private get content() {
    const contentEl = getPart<HTMLElement>(this.rootEl, modal.parts.content)
    if (!contentEl)
      throw new Error('Expected contentEl to be defined')
    return contentEl
  }

  private get closeTriggers() {
    return getParts<HTMLButtonElement>(this.content, modal.parts.closeTrigger)
      .filter(element => element.closest('[data-scope][data-part="root"]') === this.rootEl)
  }

  private renderPositioner(positionerEl: HTMLElement) {
    spreadProps(positionerEl, this.api.getPositionerProps())
  }

  private renderTrigger(triggerEl: HTMLElement, index: number) {
    spreadProps(triggerEl, this.api.getTriggerProps({ index }))
  }

  private renderBackdrop(backdropEl: HTMLElement) {
    spreadProps(backdropEl, this.api.getBackdropProps())
  }

  private renderContent(contentEl: HTMLElement) {
    spreadProps(contentEl, this.api.getContentProps())
  }

  private renderCloseTrigger(closeTriggerEl: HTMLButtonElement, index: number) {
    spreadProps(closeTriggerEl, this.api.getCloseTriggerProps({ index }))
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

export function modalInit() {
  return Modal.createAll(document)
}
