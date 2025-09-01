import { describe, expect, it } from 'vitest'

function generateDynamicRegExp(filter: string, query = '', extras: Record<string, string> = {}) {
  const escapeRegExp = (text: string) =>
    text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')

  let find = filter.replace(/\{\{(.*?)\}\}/g, (m, $1) => {
    const key = $1.trim()
    const queryFilter = extras[key]
    if (key !== 'query' && queryFilter) {
      const matcher = new RegExp(queryFilter, 'i')
      const matches = query.match(matcher)

      if (matches) {
        return escapeRegExp(matches[1])
      }

      return ''
    }
    return escapeRegExp(query)
  })

  find = `^(?:${find})$`

  return new RegExp(find, 'i')
}

describe('generateDynamicRegExp function', () => {
  it('allows for static string', () => {
    const regex = generateDynamicRegExp('something', '')
    expect(regex.test('something')).toBeTruthy()
    expect(regex.test('something else')).toBe(false)
  })

  it('allows for string replacement', () => {
    const regex = generateDynamicRegExp('something{{ query }}', ' else')
    expect(regex.test('something else')).toBeTruthy()
    expect(regex.test('something')).toBe(false)
  })

  it('allows for string replacement with filter', () => {
    const regex = generateDynamicRegExp('something{{ filter }}', ' Else', {
      filter: '([LS]+)',
    })
    expect(regex.test('somethingLS')).toBeTruthy()
    expect(regex.test('something')).toBe(false)
    expect(regex.test('something Else')).toBe(false)
  })

  it('allows for escaped string', () => {
    const regex = generateDynamicRegExp('something\\{\\{else\\}\\}', ' else')
    expect(regex.test('something{{else}}')).toBeTruthy()
    expect(regex.test('something else')).toBe(false)
  })

  it('escapes regular expression inputs', () => {
    const regex = generateDynamicRegExp('something {{query}}', '.* else')
    expect(regex.test('something .* else')).toBeTruthy()
    expect(regex.test('something ?? else')).toBe(false)
  })
})
