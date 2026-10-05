import type { Service } from '@zag-js/core'
import type { NormalizeProps, PropTypes } from '@zag-js/types'
import type { InputMaskApi, InputMaskSchema } from './input-mask.types'
import { parts } from './input-mask.anatomy'
import * as dom from './input-mask.dom'

export function connect<T extends PropTypes>(
  service: Service<InputMaskSchema>,
  normalize: NormalizeProps<T>,
): InputMaskApi<T> {
  const { send, prop, context, scope } = service

  const mask = prop('mask') ?? ''
  const value = context.get('value')
  const remainingPlaceholder = mask.substring(value.length)

  return {
    value,
    overlayValue: value,
    mask,
    remainingPlaceholder,
    setValue(value) {
      send({ type: 'VALUE.SET', value })
    },

    getRootProps() {
      return normalize.element({
        ...parts.root.attrs,
        'id': dom.getRootId(scope),
        'data-mask': mask,
      })
    },

    getContentProps() {
      return normalize.element({
        ...parts.content.attrs,
        'id': dom.getContentId(scope),
        'aria-hidden': true,
      })
    },

    getInputProps() {
      return normalize.input({
        ...parts.input.attrs,
        'id': dom.getInputId(scope),
        'maxLength': mask.length,
        'data-placeholder': mask,
        'defaultValue': value,
        onInput(event) {
          if (prop('value') === undefined)
            return
          send({ type: 'VALUE.SET', value: event.currentTarget.value })
        },
        onKeyUp(event) {
          if (prop('value') !== undefined)
            return
          send({ type: 'VALUE.SET', value: event.currentTarget.value })
        },
      })
    },
  }
}
