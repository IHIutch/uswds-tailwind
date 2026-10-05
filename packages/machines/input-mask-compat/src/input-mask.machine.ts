import type { InputMaskSchema } from './input-mask.types'
import { createMachine } from '@zag-js/core'
import * as dom from './input-mask.dom'
import { maskValue } from './input-mask.utils'

export const machine = createMachine<InputMaskSchema>({
  props({ props }) {
    return {
      defaultValue: '',
      ...props,
    }
  },

  initialState() {
    return 'idle'
  },

  context({ bindable, prop }) {
    const mask = prop('mask') ?? ''
    const initialValue = maskValue(prop('value') ?? prop('defaultValue'), mask, prop('charset'))
    return {
      value: bindable<string>(() => {
        const controlledValue = prop('value')
        return {
          defaultValue: initialValue,
          value: controlledValue === undefined
            ? undefined
            : maskValue(controlledValue, prop('mask') ?? '', prop('charset')),
        }
      }),
    }
  },

  watch({ track, action, prop }) {
    track([() => prop('value')], () => action(['syncInput']))
  },

  states: {
    idle: {
      on: {
        'VALUE.SET': { actions: ['updateValue'] },
      },
    },
  },

  implementations: {
    actions: {
      updateValue({ event, prop, context, scope }) {
        const masked = maskValue(event.value, prop('mask') ?? '', prop('charset'))
        context.set('value', masked)
        dom.setInputValue(scope, prop('value') === undefined ? masked : context.get('value'))
        prop('onValueChange')?.({ value: masked })
      },
      syncInput({ context, scope }) {
        dom.setInputValue(scope, context.get('value'))
      },
    },
  },
})
