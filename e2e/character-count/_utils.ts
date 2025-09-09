import { characterCountInit } from '../../packages/compat/src/character-count'
import { createDisposableComponent } from '../_utils'

export function createDisposableCharacterCount(id: string, template: string) {
  return createDisposableComponent(
    id,
    template,
    characterCountInit,
    () => {
      const getRootEl = () => document.getElementById(`characterCount:${id}`)
      const getLabelEl = () => document.getElementById(`characterCount:${id}:label`)
      const getInputEl = () => document.getElementById(`characterCount:${id}:input`) as HTMLInputElement | HTMLTextAreaElement
      const getStatusEl = () => document.getElementById(`characterCount:${id}:status`)
      const getSrStatusEl = () => document.getElementById(`characterCount:${id}:sr-status`)

      return {
        getRootEl,
        getLabelEl,
        getInputEl,
        getStatusEl,
        getSrStatusEl,
      }
    },
  )
}