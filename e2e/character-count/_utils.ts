import type * as characterCount from '../../packages/machines/character-count-compat/src'
import { CharacterCount, characterCountInit } from '../../packages/compat/src/character-count'
import { createDisposableComponent } from '../_utils'

export function createDisposableCharacterCount(id: string, template: string, props?: characterCount.Props) {
  return createDisposableComponent(
    template,
    () => props === undefined
      ? characterCountInit()
      : [new CharacterCount(document.getElementById(id), props).init()],
    () => {
      const getRootEl = () => document.getElementById(`character-count:${id}`)
      const getLabelEl = () => getRootEl()?.querySelector('label')
      const getInputEl = () => getRootEl()?.querySelector('[data-part="input"]') as HTMLInputElement | HTMLTextAreaElement
      const getStatusEl = () => document.getElementById(`character-count:${id}:visual-status`)
      const getSrStatusEl = () => document.getElementById(`character-count:${id}:sr-status`)
      const getInstance = () => CharacterCount.getInstance(getRootEl())

      return {
        getRootEl,
        getLabelEl,
        getInputEl,
        getStatusEl,
        getSrStatusEl,
        getInstance,
      }
    },
  )
}

export function createDisposableCharacterCounts(template: string) {
  return createDisposableComponent(
    template,
    characterCountInit,
    () => {
      const getRootEl = (id: string) => document.getElementById(`character-count:${id}`)
      const getInputEl = (id: string) => getRootEl(id)?.querySelector<HTMLInputElement | HTMLTextAreaElement>('[data-part="input"]')
      const getStatusEl = (id: string) => getRootEl(id)?.querySelector<HTMLElement>('[data-part="visual-status"]')
      const getSrStatusEl = (id: string) => getRootEl(id)?.querySelector<HTMLElement>('[data-part="sr-status"]')

      return { getRootEl, getInputEl, getStatusEl, getSrStatusEl }
    },
  )
}
