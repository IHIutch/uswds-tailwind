import { createNormalizer } from '@zag-js/types'

function toStyleString(style: any) {
  let string = ''
  for (let key in style) {
    const value = style[key]
    if (value === null || value === undefined)
      continue
    if (!key.startsWith('--'))
      key = key.replace(/[A-Z]/g, match => `-${match.toLowerCase()}`)
    string += `${key}:${value};`
  }
  return string
}

export const normalizeProps = createNormalizer((props: any) => {
  return Object.entries(props).reduce<any>((acc, [key, value]) => {
    if (key === 'style' && typeof value === 'object') {
      acc.style = toStyleString(value)
      return acc
    }

    acc[key.toLowerCase()] = value

    return acc
  }, {})
})
