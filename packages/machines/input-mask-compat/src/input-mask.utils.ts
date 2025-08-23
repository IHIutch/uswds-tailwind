export const MASKED_NUMBER_CHARS = '_#dDmMyY9'
export const MASKED_LETTER_CHARS = 'A'

export function isValidMaskedNumber(char: string): boolean {
  return /\d/.test(char)
}

export function isValidMaskedLetter(char: string): boolean {
  return /[A-Z]/i.test(char)
}

export function isValidCharForPosition(char: string, placeholderChar: string, charsetChar?: string): boolean {
  if (charsetChar) {
    if (charsetChar === 'A') {
      return isValidMaskedLetter(char)
    }
    if (charsetChar === '#') {
      return isValidMaskedNumber(char)
    }

    return char === charsetChar
  }

  if (placeholderChar === '_') {
    return isValidMaskedNumber(char)
  }

  if (MASKED_NUMBER_CHARS.includes(placeholderChar)) {
    return isValidMaskedNumber(char)
  }

  if (MASKED_LETTER_CHARS.includes(placeholderChar)) {
    return isValidMaskedLetter(char)
  }

  return char === placeholderChar
}

export function stripInvalidChars(value: string, placeholder: string, charset?: string): string {
  if (!placeholder)
    return value

  let result = ''
  let valueIndex = 0

  for (let i = 0; i < placeholder.length && valueIndex < value.length; i++) {
    const placeholderChar = placeholder[i]
    const charsetChar = charset?.[i]
    const valueChar = value[valueIndex]

    if (!placeholderChar || !valueChar)
      continue

    const isInputPosition = placeholderChar === '_' || MASKED_NUMBER_CHARS.includes(placeholderChar) || MASKED_LETTER_CHARS.includes(placeholderChar)

    if (isInputPosition) {
      if (isValidCharForPosition(valueChar, placeholderChar, charsetChar)) {
        result += valueChar
        valueIndex++
      }
      else {
        valueIndex++
        continue
      }
    }
    else {
      if (valueChar === placeholderChar) {
        result += valueChar
        valueIndex++
      }
      else {
        result += placeholderChar
      }
    }
  }

  return result
}
