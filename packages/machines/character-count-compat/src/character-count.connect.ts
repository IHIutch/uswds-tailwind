import type { Service } from '@zag-js/core'
import type { NormalizeProps, PropTypes } from '@zag-js/types'
import type { CharacterCountApi, CharacterCountSchema } from './character-count.types'
import { parts } from './character-count.anatomy'
import * as dom from './character-count.dom'

export function connect<T extends PropTypes>(
  service: Service<CharacterCountSchema>,
  normalize: NormalizeProps<T>,
): CharacterCountApi<T> {
  const { state, send, scope, context } = service

  const isInvalid = state.matches('invalid')

  return {
    // ...api,
    isInvalid,

    getRootProps() {
      return normalize.element({
        ...parts.root.attrs,
        'id': dom.getRootId(scope),
        'data-invalid': isInvalid ? 'true' : undefined,
      })
    },

    getLabelProps() {
      return normalize.label({
        ...parts.label.attrs,
        id: dom.getLabelId(scope),
        htmlFor: dom.getInputId(scope),
      })
    },

    getInputProps() {
      return normalize.input({
        ...parts.input.attrs,
        'id': dom.getInputId(scope),
        'data-invalid': isInvalid ? 'true' : undefined,
        'aria-invalid': isInvalid ? 'true' : undefined,
        onInput(event) {
          send({
            type: 'INPUT',
            value: event.currentTarget.value.length,
            // src: 'input.onInput'
          })
        },
      })
    },

    getStatusProps() {
      return normalize.element({
        ...parts.status.attrs,
        'id': dom.getStatusId(scope),
        'aria-live': 'polite',
        'data-invalid': isInvalid ? 'true' : undefined,
        //
        'textContent': context.get('statusText'),
      })
    },

    getSrStatusProps() {
      return normalize.element({
        ...parts.srStatus.attrs,
        'id': dom.getSrStatusId(scope),
        'aria-live': 'polite',
        'data-invalid': isInvalid ? 'true' : undefined,
        //
        'textContent': context.get('srStatusText'),
      })
    },
  }
}
