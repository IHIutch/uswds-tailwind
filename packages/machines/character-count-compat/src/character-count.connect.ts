import type { Service } from '@zag-js/core'
import type { NormalizeProps, PropTypes } from '@zag-js/types'
import type { CharacterCountApi, CharacterCountSchema } from './character-count.types'
import { dataAttr, visuallyHiddenStyle } from '@zag-js/dom-query'
import { parts } from './character-count.anatomy'
import * as dom from './character-count.dom'

function mergeIds(...values: Array<string | undefined>) {
  const ids = values.flatMap(value => value?.trim().split(/\s+/) ?? [])
  return [...new Set(ids)].join(' ') || undefined
}

export function connect<T extends PropTypes>(
  service: Service<CharacterCountSchema>,
  normalize: NormalizeProps<T>,
): CharacterCountApi<T> {
  const { send, prop, context, computed, scope, refs } = service

  const value = context.get('value')
  const count = value.length
  const maxLength = prop('maxLength')
  const srStatus = context.get('srStatus')
  const descriptionRendered = context.get('isDescriptionRendered')
  const invalid = computed('isOverLimit')
  const statusText = computed('statusText')

  return {
    count,
    maxLength,
    invalid,
    statusText,
    srStatusText: srStatus.text,
    value,

    setValue(next) {
      send({ type: 'VALUE.SET', value: next })
    },

    getRootProps() {
      return normalize.element({
        ...parts.root.attrs,
        'id': dom.getRootId(scope),
        'data-maxlength': prop('maxLength'),
      })
    },

    getControlProps() {
      return normalize.element({
        ...parts.control.attrs,
        'id': dom.getControlId(scope),
        'data-invalid': dataAttr(invalid),
      })
    },

    getInputProps() {
      const inputProps = {
        ...parts.input.attrs,
        'id': dom.getInputId(scope),
        'aria-describedby': mergeIds(
          prop('inputDescriptionIds'),
          descriptionRendered ? dom.getDescriptionId(scope) : undefined,
        ),
        'data-invalid': dataAttr(invalid),
        'value': value,
        onInput(event: { currentTarget: HTMLInputElement | HTMLTextAreaElement }) {
          send({ type: 'VALUE.SET', value: event.currentTarget.value })
        },
        ref(node: HTMLInputElement | HTMLTextAreaElement | null) {
          if (node) {
            node.removeAttribute('maxlength')
            dom.applyOwnedValidity(node, invalid, prop('errorText'))
          }
        },
      }
      return normalize.input(inputProps)
    },

    getDescriptionProps() {
      return normalize.element({
        ...parts.description.attrs,
        'id': dom.getDescriptionId(scope),
        'aria-live': 'off',
        'style': visuallyHiddenStyle,
        'ref': refs.get('descriptionRef'),
      })
    },

    getStatusProps() {
      return normalize.element({
        ...parts.status.attrs,
        'id': dom.getStatusId(scope),
        'aria-hidden': true,
        'data-invalid': dataAttr(invalid),
      })
    },

    getSrStatusProps() {
      return normalize.element({
        ...parts.srStatus.attrs,
        'id': dom.getSrStatusId(scope),
        'aria-live': srStatus.politeness,
        'style': visuallyHiddenStyle,
      })
    },
  }
}
