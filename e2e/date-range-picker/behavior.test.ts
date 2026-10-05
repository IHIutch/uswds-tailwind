import { expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'
import { datePickerInit } from '../../packages/compat/src/date-picker.js'
import { dateRangePickerInit } from '../../packages/compat/src/date-range-picker.js'
import { createRangeFixture, day, nextFrame, rangeDays } from './behavior-fixture.js'

type Endpoint = 'start' | 'end'

it('keeps range roots owned by the range adapter across repeated initialization', { tags: ['new'] }, async () => {
  await using component = createRangeFixture()
  expect(component.elements.getRootEl()).toBeTruthy()
  expect(datePickerInit()).toEqual([])
  const first = dateRangePickerInit()[0]
  expect(dateRangePickerInit()[0]).toBe(first)
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/index.js#L1330-L1340 (selection closes the calendar and focuses its visible input)
// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-range-picker/src/index.js#L65-L105 (peer updates change bounds, not the sibling value)
it.each(['start', 'end'] as const)('selecting the %s date preserves the other date and restores input focus', { tags: ['parity'] }, async (endpoint) => {
  await using component = createRangeFixture()
  const start = component.elements.getStartInputEl()!
  const end = component.elements.getEndInputEl()!
  const input = endpoint === 'start' ? start : end
  const trigger = endpoint === 'start' ? component.elements.getStartTriggerEl()! : component.elements.getEndTriggerEl()!
  await userEvent.fill(start, '06/10/2024')
  await userEvent.fill(end, '06/20/2024')
  await userEvent.click(trigger)

  expect(component.elements.getCalendarEl()!.hidden).toBe(false)
  expect(day(endpoint === 'start' ? '2024-06-21' : '2024-06-09').disabled).toBe(true)
  await userEvent.click(day('2024-06-15'))

  const expected = endpoint === 'start' ? ['06/15/2024', '06/20/2024'] : ['06/10/2024', '06/15/2024']
  expect([start.value, end.value]).toEqual(expected)
  expect(Array.from(new FormData(document.querySelector('form')!).values())).toEqual(expected)
  expect(component.elements.getCalendarEl()!.hidden).toBe(true)
  await expect.poll(() => document.activeElement).toBe(input)
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/index.js#L1347-L1359
it.each([
  { endpoint: 'start', draft: '13/45/2024', focused: '2024-12-20', month: 'December 2024' },
  { endpoint: 'end', draft: '13/45/2024', focused: '2024-12-20', month: 'December 2024' },
  { endpoint: 'start', draft: '2/5/24', focused: '2024-02-10', month: 'February 2024' },
  { endpoint: 'end', draft: '2/5/24', focused: '2024-02-10', month: 'February 2024' },
] as const)('opens the $endpoint calendar from adjusted draft $draft within its bounds', { tags: ['parity'] }, async ({ endpoint, draft, focused, month }) => {
  await using component = createRangeFixture({ min: '2024-02-10', max: '2024-12-20' })
  const input = endpoint === 'start' ? component.elements.getStartInputEl()! : component.elements.getEndInputEl()!
  const trigger = endpoint === 'start' ? component.elements.getStartTriggerEl()! : component.elements.getEndTriggerEl()!
  await userEvent.fill(input, draft)
  await userEvent.click(trigger)

  expect(component.elements.getCalendarEl()!.hidden).toBe(false)
  expect(document.querySelector('[data-part="view-trigger"][data-view="month"]')?.textContent).toBe(month.split(' ')[0])
  expect(document.querySelector('[data-part="view-trigger"][data-view="year"]')?.textContent).toBe('2024')
  await expect.poll(() => document.activeElement).toBe(day(focused))
  expect(input.value).toBe(draft)
})

const cases: Array<{
  name: string
  endpoint: Endpoint
  value: string
  peer: string
  bounds?: { min: string, max: string }
  disabled?: string
  enabled: string
}> = [
  { name: 'start empty', endpoint: 'start', value: '', peer: '12/20/2020', enabled: '2020-12-11' },
  { name: 'start valid', endpoint: 'start', value: '12/12/2020', peer: '12/20/2020', disabled: '2020-12-11', enabled: '2020-12-12' },
  { name: 'start invalid', endpoint: 'start', value: 'ab/dc/efg', peer: '12/20/2020', enabled: '2020-12-11' },
  { name: 'end empty', endpoint: 'end', value: '', peer: '12/01/2020', enabled: '2020-12-12' },
  { name: 'end valid', endpoint: 'end', value: '12/11/2020', peer: '12/01/2020', disabled: '2020-12-12', enabled: '2020-12-11' },
  { name: 'end invalid', endpoint: 'end', value: '35/35/3535', peer: '12/01/2020', enabled: '2020-12-12' },
  { name: 'bounded start empty', endpoint: 'start', value: '', peer: '05/30/2020', bounds: { min: '2020-05-22', max: '2021-06-20' }, disabled: '2020-05-21', enabled: '2020-05-22' },
  { name: 'bounded start valid', endpoint: 'start', value: '05/25/2020', peer: '05/30/2020', bounds: { min: '2020-05-22', max: '2021-06-20' }, disabled: '2020-05-24', enabled: '2020-05-25' },
  { name: 'bounded start invalid', endpoint: 'start', value: 'ab/dc/efg', peer: '05/30/2020', bounds: { min: '2020-05-22', max: '2021-06-20' }, disabled: '2020-05-21', enabled: '2020-05-22' },
  { name: 'bounded end empty', endpoint: 'end', value: '', peer: '06/10/2021', bounds: { min: '2020-05-22', max: '2021-06-20' }, disabled: '2021-06-21', enabled: '2021-06-20' },
  { name: 'bounded end valid', endpoint: 'end', value: '06/15/2021', peer: '06/10/2021', bounds: { min: '2020-05-22', max: '2021-06-20' }, disabled: '2021-06-20', enabled: '2021-06-15' },
  { name: 'bounded end invalid', endpoint: 'end', value: '35/35/3535', peer: '06/10/2021', bounds: { min: '2020-05-22', max: '2021-06-20' }, disabled: '2021-06-21', enabled: '2021-06-20' },
]

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-range-picker/src/index.js#L64-L105 (input events update the peer's bounds and calendar)
// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-range-picker/src/index.js#L150-L159 (both endpoints handle input and change)
// These browser assertions extend the legacy specs, which inspect datasets rather than rendered calendar days.
it.each(cases)('$name updates the peer calendar without changing its value', { tags: ['parity'] }, async ({ endpoint, value, peer, bounds, disabled, enabled }) => {
  await using component = createRangeFixture({ ...bounds, [endpoint === 'start' ? 'end' : 'start']: peer })
  const start = component.elements.getStartInputEl()!
  const end = component.elements.getEndInputEl()!
  const changed = endpoint === 'start' ? start : end
  const other = endpoint === 'start' ? end : start
  const otherTrigger = endpoint === 'start' ? component.elements.getEndTriggerEl()! : component.elements.getStartTriggerEl()!

  if (value) {
    await userEvent.fill(changed, value)
  }
  else {
    await userEvent.fill(changed, '01/01/2020')
    await userEvent.clear(changed)
  }
  await userEvent.click(otherTrigger)

  expect(changed.value).toBe(value)
  expect(other.value).toBe(peer)
  if (disabled) {
    expect(day(disabled).disabled).toBe(true)
  }
  expect(day(enabled).disabled).toBe(false)
  expect(new FormData(document.querySelector('form')!).get(endpoint === 'start' ? 'end' : 'start')).toBe(peer)
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-range-picker/src/index.js#L70-L98 (the peer date becomes the range anchor)
// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/index.js#L469-L475 (endpoint and interior dates)
it('marks the committed endpoints and only the days between them', { tags: ['parity'] }, async () => {
  await using component = createRangeFixture({ start: '06/10/2024', end: '06/20/2024' })
  await userEvent.click(component.elements.getStartTriggerEl()!)

  expect(day('2024-06-10').hasAttribute('data-range-start')).toBe(true)
  expect(day('2024-06-20').hasAttribute('data-range-end')).toBe(true)
  expect(rangeDays('[data-in-range]')).toEqual(Array.from({ length: 9 }, (_, i) => `2024-06-${String(i + 11).padStart(2, '0')}`))
  expect(day('2024-06-09').hasAttribute('data-in-range')).toBe(false)
  expect(day('2024-06-21').hasAttribute('data-in-range')).toBe(false)
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-range-picker/src/index.js#L64-L105 (updating one endpoint changes only the peer's bounds)
// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/index.js#L632-L642 (internal change event carries the ISO value)
it('retyping one endpoint preserves the other endpoint and the painted range', { tags: ['parity'] }, async () => {
  await using component = createRangeFixture()
  const start = component.elements.getStartInputEl()!
  const end = component.elements.getEndInputEl()!
  const changes: Array<{ endpoint: number, value: string }> = []
  document.querySelectorAll<HTMLInputElement>('[data-part="hidden-input"]').forEach((input, endpoint) => {
    input.addEventListener('change', (event) => {
      changes.push({ endpoint, value: (event as CustomEvent<{ value: string }>).detail.value })
    })
  })
  await userEvent.fill(start, '06/10/2024')
  await userEvent.fill(end, '06/20/2024')
  await userEvent.fill(start, '06/12/2024')

  expect([start.value, end.value]).toEqual(['06/12/2024', '06/20/2024'])
  expect(changes).toContainEqual({ endpoint: 0, value: '2024-06-12' })
  expect(changes).toContainEqual({ endpoint: 1, value: '2024-06-20' })
  expect([...new FormData(document.querySelector('form')!).values()]).toEqual(['06/12/2024', '06/20/2024'])
  await userEvent.click(component.elements.getStartTriggerEl()!)
  expect(day('2024-06-12').hasAttribute('data-range-start')).toBe(true)
  expect(day('2024-06-20').hasAttribute('data-range-end')).toBe(true)
  expect(day('2024-06-15').hasAttribute('data-in-range')).toBe(true)
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-range-picker/src/index.js#L70-L104 (selection changes peer bounds without clearing its value)
// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/index.js#L1330-L1339 (selecting a day closes the calendar and restores input focus)
it.each([
  { name: 'full range', start: '06/10/2024', end: '06/20/2024', pickedStart: '2024-06-15' },
  { name: 'end first', start: '', end: '06/20/2024', pickedStart: '2024-06-10' },
])('selecting a start preserves the $name end value', { tags: ['parity'] }, async ({ start, end, pickedStart }) => {
  await using component = createRangeFixture({ start, end })
  const startInput = component.elements.getStartInputEl()!
  const endInput = component.elements.getEndInputEl()!
  await userEvent.click(component.elements.getStartTriggerEl()!)
  expect(day('2024-06-21').disabled).toBe(true)
  await userEvent.click(day(pickedStart))
  await nextFrame()

  expect(startInput.value).toBe(pickedStart === '2024-06-15' ? '06/15/2024' : '06/10/2024')
  expect(endInput.value).toBe(end)
  expect(component.elements.getCalendarEl()!.hidden).toBe(true)
  expect(document.activeElement).toBe(startInput)
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-range-picker/src/index.js#L70-L80 (the committed start becomes the end picker's minimum)
// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/index.js#L1028-L1031 (days outside the active bounds are disabled)
it('rejects an end date typed before the start and disables earlier calendar days', { tags: ['parity'] }, async () => {
  await using component = createRangeFixture()
  const start = component.elements.getStartInputEl()!
  const end = component.elements.getEndInputEl()!
  await userEvent.fill(start, '06/10/2024')
  await userEvent.fill(end, '06/05/2024')
  await userEvent.click(component.elements.getEndTriggerEl()!)

  expect(start.value).toBe('06/10/2024')
  expect(end.value).toBe('06/05/2024')
  expect(day('2024-06-09').disabled).toBe(true)
  expect(day('2024-06-10').disabled).toBe(false)
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-range-picker/src/index.js#L94-L98 (the end becomes the start picker's default date and maximum)
// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/index.js#L1347-L1359 (opening uses the default date without selecting it)
it('opens the blank start calendar on an end-first date', { tags: ['parity'] }, async () => {
  await using component = createRangeFixture({ end: '06/20/2024' })
  await userEvent.click(component.elements.getStartTriggerEl()!)

  expect(component.elements.getCalendarEl()!.getAttribute('data-value')).toBe('2024-06-20')
  expect(day('2024-06-20').disabled).toBe(false)
  expect(day('2024-06-21').disabled).toBe(true)
  expect(component.elements.getStartInputEl()!.value).toBe('')
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/index.js#L1317-L1362 (toggle and selection close the calendar and restore input focus)
// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-range-picker/src/index.js#L70-L98 (each endpoint has its own date and bounds)
it('switches between endpoint calendars and restores focus after selection', { tags: ['parity'] }, async () => {
  await using component = createRangeFixture({ start: '06/10/2024' })
  const calendar = component.elements.getCalendarEl()!
  const end = component.elements.getEndInputEl()!
  await userEvent.click(component.elements.getStartTriggerEl()!)
  expect(calendar.hidden).toBe(false)
  await userEvent.click(component.elements.getEndTriggerEl()!)
  expect(calendar.hidden).toBe(false)
  expect(calendar.getAttribute('data-value')).toBe('2024-06-10')
  await userEvent.click(day('2024-06-20'))
  await nextFrame()

  expect(calendar.hidden).toBe(true)
  expect(end.value).toBe('06/20/2024')
  expect(document.activeElement).toBe(end)
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/index.js#L1330-L1339 (each day selection closes and focuses its own input)
// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-range-picker/src/index.js#L64-L105 (a start selection constrains the end without selecting it)
it('selects start then end in separate calendar sessions', { tags: ['parity'] }, async () => {
  await using component = createRangeFixture({ min: '2024-06-01', max: '2024-06-30' })
  const start = component.elements.getStartInputEl()!
  const end = component.elements.getEndInputEl()!
  const calendar = component.elements.getCalendarEl()!

  await userEvent.click(component.elements.getStartTriggerEl()!)
  await userEvent.click(day('2024-06-10'))
  await nextFrame()
  expect(calendar.hidden).toBe(true)
  expect(document.activeElement).toBe(start)
  expect([start.value, end.value]).toEqual(['06/10/2024', ''])

  await userEvent.click(component.elements.getEndTriggerEl()!)
  expect(calendar.hidden).toBe(false)
  expect(day('2024-06-09').disabled).toBe(true)
  await userEvent.click(day('2024-06-20'))
  await nextFrame()
  expect(calendar.hidden).toBe(true)
  expect(document.activeElement).toBe(end)
  expect([start.value, end.value]).toEqual(['06/10/2024', '06/20/2024'])
  expect([...new FormData(document.querySelector('form')!).values()]).toEqual(['06/10/2024', '06/20/2024'])
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/index.js#L1330-L1339 (selection closes and restores focus to the selected input)
// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-range-picker/src/index.js#L88-L104 (an end selection constrains the blank start but preserves the end value)
it('selects end before start without moving the end into the start field', { tags: ['parity'] }, async () => {
  await using component = createRangeFixture({ min: '2024-06-01', max: '2024-06-30' })
  const start = component.elements.getStartInputEl()!
  const end = component.elements.getEndInputEl()!
  const calendar = component.elements.getCalendarEl()!

  await userEvent.click(component.elements.getEndTriggerEl()!)
  await userEvent.click(day('2024-06-20'))
  await nextFrame()
  expect(calendar.hidden).toBe(true)
  expect(document.activeElement).toBe(end)
  expect([start.value, end.value]).toEqual(['', '06/20/2024'])

  await userEvent.click(component.elements.getStartTriggerEl()!)
  expect(calendar.getAttribute('data-value')).toBe('2024-06-20')
  expect(day('2024-06-21').disabled).toBe(true)
  await userEvent.click(day('2024-06-10'))
  await nextFrame()
  expect(calendar.hidden).toBe(true)
  expect(document.activeElement).toBe(start)
  expect([start.value, end.value]).toEqual(['06/10/2024', '06/20/2024'])
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/index.js#L1844-L1874 (hover paints interior days without selecting an endpoint)
it('previews only interior days when hovering an end date', { tags: ['parity'] }, async () => {
  await using component = createRangeFixture({ start: '06/10/2024' })
  await userEvent.click(component.elements.getEndTriggerEl()!)
  await userEvent.hover(day('2024-06-20'))

  expect(rangeDays('[data-in-range]')).toEqual(Array.from({ length: 9 }, (_, i) => `2024-06-${String(i + 11).padStart(2, '0')}`))
  expect(day('2024-06-10').hasAttribute('data-range-start')).toBe(true)
  expect(day('2024-06-20').hasAttribute('data-range-end')).toBe(false)
  expect(component.elements.getEndInputEl()!.value).toBe('')
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/index.js#L2265-L2270 (mouseover is delegated only to current-month cells)
it('ignores hover over an adjacent-month day', { tags: ['parity'] }, async () => {
  await using component = createRangeFixture({ start: '06/10/2024' })
  await userEvent.click(component.elements.getEndTriggerEl()!)
  await userEvent.hover(day('2024-07-03'))
  expect(rangeDays('[data-in-range]')).toEqual([])
  await userEvent.hover(day('2024-06-20'))
  expect(day('2024-06-15').hasAttribute('data-in-range')).toBe(true)
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/index.js#L1010-L1015 (calendar rendering uses the focused date when no date is selected)
// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/index.js#L1752-L1764 (keyboard navigation clamps to the active bounds)
it('previews the keyboard focused date and cannot focus before the start', { tags: ['parity'] }, async () => {
  await using component = createRangeFixture({ start: '06/10/2024' })
  await userEvent.click(component.elements.getEndTriggerEl()!)
  await nextFrame()
  expect(document.activeElement?.getAttribute('data-value')).toBe('2024-06-10')
  await userEvent.keyboard('{ArrowRight}{ArrowRight}')
  await nextFrame()
  expect(document.activeElement?.getAttribute('data-value')).toBe('2024-06-12')
  expect(rangeDays('[data-in-range]')).toEqual(['2024-06-11'])
  await userEvent.keyboard('{ArrowUp}')
  await nextFrame()
  expect(document.activeElement?.getAttribute('data-value')).toBe('2024-06-10')
  expect(rangeDays('[data-in-range]')).toEqual([])
  expect(day('2024-06-09').disabled).toBe(true)
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/index.js#L1317-L1362 (closing hides the calendar and reopening renders it)
// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/index.js#L1844-L1874 (hover paint belongs to the current calendar)
it('drops a hover preview after closing and reopening the end calendar', { tags: ['parity'] }, async () => {
  await using component = createRangeFixture({ start: '06/10/2024' })
  const trigger = component.elements.getEndTriggerEl()!
  await userEvent.click(trigger)
  await userEvent.hover(day('2024-06-20'))
  expect(day('2024-06-15').hasAttribute('data-in-range')).toBe(true)
  await userEvent.click(trigger)
  await userEvent.click(trigger)
  expect(day('2024-06-15').hasAttribute('data-in-range')).toBe(false)
  expect(component.elements.getEndInputEl()!.value).toBe('')
})
