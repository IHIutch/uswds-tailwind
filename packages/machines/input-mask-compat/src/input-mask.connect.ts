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

    getInputProps() {
      const placeholder = prop('placeholder')
      const charset = prop('charset')
      const maxLength = prop('maxlength') ?? (placeholder ? placeholder.length : undefined)

      return normalize.input({
        ...parts.input.attrs,
        id: dom.getInputId(scope),
        value: context.get('value'),
        maxLength,
        placeholder: '',
        onKeyUp(event: any) {
          const inputElement = event.currentTarget as HTMLInputElement
          const currentValue = inputElement.value

          const strippedValue = stripInvalidChars(currentValue, placeholder || '', charset)

          if (strippedValue !== currentValue) {
            inputElement.value = strippedValue
          }

          send({ type: 'INPUT', value: strippedValue })
        },
        onInput(event: any) {
          const inputElement = event.currentTarget as HTMLInputElement
          const currentValue = inputElement.value
          send({ type: 'INPUT', value: currentValue })
        },
      })
    },

    getValue() {
      return context.get('value')
    },

    getDynamicPlaceholder() {
      return context.get('dynamicPlaceholder')
    },

    getPlaceholderProps() {
      return normalize.element({
        ...parts.placeholder.attrs,
        id: `${dom.getRootId(scope)}-placeholder`,
        children: context.get('dynamicPlaceholder'),
      })
    },
  }
}
