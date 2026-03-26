import type { Service } from '@zag-js/core'
import type { NormalizeProps, PropTypes } from '@zag-js/types'
import type { InputMaskApi, InputMaskSchema } from './input-mask.types'
import { parts } from './input-mask.anatomy'
import * as dom from './input-mask.dom'
import { stripInvalidChars } from './input-mask.utils'

export function connect<T extends PropTypes>(
  service: Service<InputMaskSchema>,
  normalize: NormalizeProps<T>,
): InputMaskApi<T> {
  const { send, scope, context, prop } = service

  return {
    getRootProps() {
      return normalize.element({
        ...parts.root.attrs,
        id: dom.getRootId(scope),
      })
    },

    getLabelProps() {
      return normalize.label({
        ...parts.label.attrs,
        id: dom.getLabelId(scope),
        htmlFor: dom.getInputId(scope),
      })
    },

    getDescriptionProps() {
      return normalize.element({
        ...parts.description.attrs,
        id: dom.getDescriptionId(scope),
      })
    },

    getInputProps() {
      const placeholder = prop('placeholder')
      const charset = prop('charset')
      const maxLength = prop('maxlength') ?? (placeholder ? placeholder.length : undefined)

      return normalize.input({
        ...parts.input.attrs,
        'id': dom.getInputId(scope),
        'value': context.get('value'),
        maxLength,
        'placeholder': '',
        'aria-describedby': dom.getDescriptionId(scope),
        onKeyUp(event) {
          const inputElement = event.currentTarget as HTMLInputElement
          const currentValue = inputElement.value

          const strippedValue = stripInvalidChars(currentValue, placeholder || '', charset)

          if (strippedValue !== currentValue) {
            inputElement.value = strippedValue
          }

          send({ type: 'INPUT', value: strippedValue })
        },
        onInput(event) {
          const inputElement = event.currentTarget as HTMLInputElement
          const currentValue = inputElement.value
          send({ type: 'INPUT', value: currentValue })
        },
      })
    },

    getValue() {
      return context.get('value')
    },
  }
}
