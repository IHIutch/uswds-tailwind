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
  const maxLength = prop('maxLength') ?? 0
  const srStatusText = context.get('srStatusText')
  const srStatusPoliteness = context.get('srStatusPoliteness')
  const srLiveEnabled = context.get('srLiveEnabled')
  const hintRendered = context.get('isHintRendered')
  const invalid = computed('isOverLimit')
  const statusText = computed('statusText')

  return {
    count,
    maxLength,
    invalid,
    statusText,
    srStatusText,
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

    getFormGroupProps() {
      return normalize.element({
        ...parts.formGroup.attrs,
        'id': dom.getFormGroupId(scope),
        'data-invalid': dataAttr(invalid),
      })
    },

    getInputProps() {
      const inputProps: Parameters<typeof normalize.input>[0] & {
        ref: (node: HTMLInputElement | HTMLTextAreaElement | null) => void
      } = {
        ...parts.input.attrs,
        'id': dom.getInputId(scope),
        'aria-describedby': mergeIds(
          prop('inputDescriptionIds'),
          hintRendered ? dom.getHintId(scope) : undefined,
        ),
        'data-invalid': dataAttr(invalid),
        'value': value,
        onInput(event: { currentTarget: HTMLInputElement | HTMLTextAreaElement }) {
          send({ type: 'INPUT.CHANGE', value: event.currentTarget.value })
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

    getHintProps() {
      return normalize.element({
        ...parts.hint.attrs,
        'id': dom.getHintId(scope),
        'aria-live': 'off',
        'style': visuallyHiddenStyle,
        'ref': refs.get('hintRef'),
      })
    },

    getVisualStatusProps() {
      return normalize.element({
        ...parts.visualStatus.attrs,
        'id': dom.getVisualStatusId(scope),
        'aria-hidden': true,
        'data-invalid': dataAttr(invalid),
      })
    },

    getSrStatusProps() {
      return normalize.element({
        ...parts.srStatus.attrs,
        'id': dom.getSrStatusId(scope),
        'aria-live': srLiveEnabled ? srStatusPoliteness : undefined,
        'style': visuallyHiddenStyle,
      })
    },
  }
}
