import { accordionInit } from '../../packages/compat/src/accordion'
import { createDisposableComponent } from '../_utils'

export function createDisposableAccordion(id: string, template: string) {
  return createDisposableComponent(
    template,
    accordionInit,
    () => {
      const getRootEl = () => document.getElementById(`accordion:${id}`)
      const getTriggerEl = (value: string) => document.getElementById(`accordion:${id}:trigger:${value}`)
      const getContentEl = (value: string) => document.getElementById(`accordion:${id}:content:${value}`)
      const getAllTriggerEls = () => Array.from(getRootEl()?.querySelectorAll<HTMLElement>('[data-part="accordion-trigger"]') ?? [])

      return {
        getRootEl,
        getTriggerEl,
        getContentEl,
        getAllTriggerEls,
      }
    },
  )
}
