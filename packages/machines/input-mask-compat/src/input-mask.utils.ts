const NUMBER_SLOTS = '_#dDmMyY9'

export function maskValue(rawValue: string, mask: string, charset?: string): string {
  const pattern = charset || mask
  const stripped = charset ? rawValue.replace(/\W/g, '') : rawValue.replace(/\D/g, '')
  let result = ''
  let inputIndex = 0

  for (let patternIndex = 0; patternIndex < pattern.length; patternIndex++) {
    const slot = pattern[patternIndex]!
    const char = stripped[inputIndex]

    if (NUMBER_SLOTS.includes(slot)) {
      if (char === undefined || Number.isNaN(Number.parseInt(char, 10)))
        return result
      result += char
      inputIndex++
    }
    else if (charset && slot === 'A') {
      if (!char || !/[A-Z]/i.test(char))
        return result
      result += char
      inputIndex++
    }
    else {
      result += slot
    }

    if (stripped[inputIndex] === undefined)
      break
  }

  return result
}
