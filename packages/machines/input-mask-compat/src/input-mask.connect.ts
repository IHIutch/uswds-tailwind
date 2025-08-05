import type { Service } from '@zag-js/core'
import type { NormalizeProps, PropTypes } from '@zag-js/types'
import type { InputMaskApi, InputMaskSchema } from './input-mask.types'
import { parts } from './input-mask.anatomy'
import * as dom from './input-mask.dom'

export function connect<T extends PropTypes>(
  service: Service<InputMaskSchema>,
  normalize: NormalizeProps<T>,
): InputMaskApi<T> {
  const { send, scope } = service

  return {
    getRootProps() {
      return normalize.element({
        ...parts.root.attrs,
        id: dom.getRootId(scope),
      })
    },

    getInputProps() {
      return normalize.input({
        ...parts.input.attrs,
        id: dom.getInputId(scope),
        onInput(event) {
          send({ type: 'INPUT', value: event.currentTarget.value })
        },
      })
    },
  }
}
