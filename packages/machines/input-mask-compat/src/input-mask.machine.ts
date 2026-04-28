import type { InputMaskSchema } from './input-mask.types'
import { createMachine } from '@zag-js/core'

const maskedNumber = '_#dDmMyY9'
const maskedLetter = 'A'

function strippedValue(isCharsetPresent: boolean, value: string) {
  return isCharsetPresent ? value.replace(/\W/g, '') : value.replace(/\D/g, '')
}

function isInteger(value: string | undefined) {
  return value !== undefined && !Number.isNaN(Number.parseInt(value, 10))
}

function isLetter(value: string | undefined) {
  return value ? !!value.match(/[A-Z]/i) : false
}

export function applyMask(value: string, placeholder: string, charset: string | undefined) {
  const isCharsetPresent = !!charset
  const template = charset || placeholder
  const len = template.length
  let newValue = ''
  let charIndex = 0

  const strippedVal = strippedValue(isCharsetPresent, value)

  for (let i = 0; i < len; i += 1) {
    const isInt = isInteger(strippedVal[charIndex])
    const isLet = isLetter(strippedVal[charIndex])
    const matchesNumber = maskedNumber.includes(template[i]!)
    const matchesLetter = maskedLetter.includes(template[i]!)

    if (
      (matchesNumber && isInt)
      || (isCharsetPresent && matchesLetter && isLet)
    ) {
      newValue += strippedVal[charIndex]!
      charIndex += 1
    }
    else if (
      (!isCharsetPresent && !isInt && matchesNumber)
      || (isCharsetPresent
        && ((matchesLetter && !isLet) || (matchesNumber && !isInt)))
    ) {
      return newValue
    }
    else {
      newValue += template[i]!
    }
    if (strippedVal[charIndex] === undefined) {
      break
    }
  }

  return newValue
}

/* -----------------------------------------------------------------------------
 * Machine
 * ----------------------------------------------------------------------------- */

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

  context({ prop, bindable }) {
    return {
      value: bindable<string>(() => ({
        defaultValue: prop('defaultValue'),
        value: prop('value'),
      })),
    }
  },

  computed: {
    enteredText: ({ context }) => context.get('value'),
    // `!` safe: placeholder is a required prop
    remainingPlaceholder: ({ context, prop }) =>
      prop('placeholder')!.substring(context.get('value').length),
    // `!` safe: placeholder is a required prop
    maxLength: ({ prop }) => prop('placeholder')!.length,
  },

  states: {
    idle: {
      on: {
        'VALUE_CHANGE': {
          actions: ['setValue'],
        },
        'INPUT.FOCUS': {
          target: 'focused',
        },
      },
    },
    focused: {
      on: {
        'VALUE_CHANGE': {
          actions: ['setValue'],
        },
        'INPUT.BLUR': {
          target: 'idle',
        },
      },
    },
  },

  implementations: {
    actions: {
      //   inputEl.value = handleCurrentValue(inputEl)
      // Validates raw input against mask, stores validated result, fires callback.
      setValue({ context, prop, event }) {
        const rawValue = event.value as string
        const validated = applyMask(rawValue, prop('placeholder')!, prop('charset'))
        context.set('value', validated)
        // Fire callback manually after set (per gotcha: consistent snapshot)
        prop('onValueChange')?.({ value: validated })
      },
    },
  },
})
