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
      const getAllTriggerEls = () => Array.from(getRootEl()?.querySelectorAll<HTMLElement>('[data-part="item-trigger"]') ?? [])

      return {
        getRootEl,
        getTriggerEl,
        getContentEl,
        getAllTriggerEls,
      }
    },
  )
}

// Finds parts through the markup rather than generated ids, so several accordions (including nested ones) can be addressed in one test.
export function createDisposableAccordions(template: string) {
  return createDisposableComponent(
    template,
    accordionInit,
    () => {
      const getRootEl = (id: string) => document.getElementById(`accordion:${id}`)
      const getItemEl = (id: string, value: string) => getRootEl(id)?.querySelector<HTMLElement>(`:scope > [data-part="item"][data-value="${value}"]`) ?? null
      const getTriggerEl = (id: string, value: string) => getItemEl(id, value)?.querySelector<HTMLElement>(':scope > [data-part="item-trigger"]') ?? null
      const getContentEl = (id: string, value: string) => getItemEl(id, value)?.querySelector<HTMLElement>(':scope > [data-part="item-content"]') ?? null

      return {
        getRootEl,
        getItemEl,
        getTriggerEl,
        getContentEl,
      }
    },
  )
}
