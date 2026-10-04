import { query, queryAll } from '@zag-js/dom-query'
import { expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'
import { createDisposableDatePicker } from './_utils.js'

const rootId = 'test'

// Template with default date to match legacy test
const template = `
    <div>
      <div>
        <label for="input-dob">Date of birth</label>
        <div data-scope="date-picker" data-part="root" id="${rootId}" data-default-value="2020-05-15">
          <input data-part="input" id="input-dob" name="input-dob" type="text">
          <input data-part="hidden-input" type="hidden">
          <button data-part="trigger" type="button"></button>
          <div data-part="content" hidden>
            <div data-part="view" data-view="day">
              <div data-part="view-control">
                <button data-part="prev-trigger" data-unit="year" type="button"></button>
                <button data-part="prev-trigger" data-unit="month" type="button"></button>
                <button data-part="view-trigger" data-view="month" type="button"></button>
                <button data-part="view-trigger" data-view="year" type="button"></button>
                <button data-part="next-trigger" data-unit="month" type="button"></button>
                <button data-part="next-trigger" data-unit="year" type="button"></button>
              </div>
              <table>
                <thead>
                  <tr>
                    <th data-part="table-header"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <button data-part="table-cell-trigger"></button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div data-part="view" data-view="month">
              <table>
                <tbody>
                  <tr>
                    <td>
                      <button data-part="table-cell-trigger"></button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div data-part="view" data-view="year">
              <table>
                <tbody>
                  <tr>
                    <td>
                      <button data-part="table-cell-trigger"></button>
                    </td>
                  </tr>
                </tbody>
              </table>
              <button data-part="prev-trigger" data-unit="chunk"></button>
              <button data-part="next-trigger" data-unit="chunk"></button>
            </div>
          </div>
          <div data-part="status"></div>
        </div>
      </div>
    </div>
  `

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/test/date-picker-i18n.spec.js#L43
it('should display month in english by default', { tags: ['legacy'] }, async () => {
  document.documentElement.lang = 'en'

  await using component = createDisposableDatePicker(rootId, template)
  const root = component.elements.getRootEl()!
  const button = component.elements.getTriggerEl()!

  await userEvent.click(button)

  const monthTrigger = query(root, '[data-part="view-trigger"][data-view="month"]')
  expect(monthTrigger?.textContent).toBe('May')
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/test/date-picker-i18n.spec.js#L53
it('should display month in the document language', { tags: ['legacy'] }, async () => {
  document.documentElement.lang = 'es'

  await using component = createDisposableDatePicker(rootId, template)
  const root = component.elements.getRootEl()!
  const button = component.elements.getTriggerEl()!

  await userEvent.click(button)

  const monthTrigger = query(root, '[data-part="view-trigger"][data-view="month"]')
  expect(monthTrigger?.textContent).toBe('mayo')
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/test/date-picker-i18n.spec.js#L65
it('should display the correct aria-label in the document language', { tags: ['legacy'] }, async () => {
  document.documentElement.lang = 'es'

  await using component = createDisposableDatePicker(rootId, template)
  const root = component.elements.getRootEl()!
  const button = component.elements.getTriggerEl()!

  await userEvent.click(button)

  const monthTrigger = query(root, '[data-part="view-trigger"][data-view="month"]')
  expect(monthTrigger?.getAttribute('aria-label')).toBe('mayo. Select month')
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/test/date-picker-i18n.spec.js#L80
it('should display the full list of months in english by default', { tags: ['legacy'] }, async () => {
  document.documentElement.lang = 'en'

  await using component = createDisposableDatePicker(rootId, template)
  const root = component.elements.getRootEl()!
  const button = component.elements.getTriggerEl()!

  await userEvent.click(button)

  const monthTrigger = query(root, '[data-part="view-trigger"][data-view="month"]')!
  await userEvent.click(monthTrigger)

  const monthButtons = queryAll(root, '[data-part="view"][data-view="month"] [data-part="table-cell-trigger"]').map(btn => btn.textContent)

  expect(monthButtons).toEqual([
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ])
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/test/date-picker-i18n.spec.js#L109
it('should display the full list of months in the document language', { tags: ['legacy'] }, async () => {
  document.documentElement.lang = 'es'

  await using component = createDisposableDatePicker(rootId, template)
  const root = component.elements.getRootEl()!
  const button = component.elements.getTriggerEl()!

  await userEvent.click(button)

  const monthTrigger = query(root, '[data-part="view-trigger"][data-view="month"]')!
  await userEvent.click(monthTrigger)

  const monthButtons = queryAll(root, '[data-part="view"][data-view="month"] [data-part="table-cell-trigger"]').map(btn => btn.textContent)

  expect(monthButtons).toEqual([
    'enero',
    'febrero',
    'marzo',
    'abril',
    'mayo',
    'junio',
    'julio',
    'agosto',
    'septiembre',
    'octubre',
    'noviembre',
    'diciembre',
  ])
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/test/date-picker-i18n.spec.js#L140
it('should display the days of the week headers in english by default', { tags: ['legacy'] }, async () => {
  document.documentElement.lang = 'en'

  await using component = createDisposableDatePicker(rootId, template)
  const root = component.elements.getRootEl()!
  const button = component.elements.getTriggerEl()!

  await userEvent.click(button)

  const dayHeaders = queryAll(root, '[data-part="table-header"]').map(header => header.textContent)

  expect(dayHeaders).toEqual(['S', 'M', 'T', 'W', 'T', 'F', 'S'])
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/test/date-picker-i18n.spec.js#L150
it('should display the days of the week headers in the document language', { tags: ['legacy'] }, async () => {
  document.documentElement.lang = 'es'

  await using component = createDisposableDatePicker(rootId, template)
  const root = component.elements.getRootEl()!
  const button = component.elements.getTriggerEl()!

  await userEvent.click(button)

  const dayHeaders = queryAll(root, '[data-part="table-header"]').map(header => header.textContent)

  expect(dayHeaders).toEqual(['D', 'L', 'M', 'X', 'J', 'V', 'S'])
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-date-picker/src/test/date-picker-i18n.spec.js#L162
it('should display the aria-label in the document language', { tags: ['legacy'] }, async () => {
  document.documentElement.lang = 'es'

  await using component = createDisposableDatePicker(rootId, template)
  const root = component.elements.getRootEl()!
  const button = component.elements.getTriggerEl()!

  await userEvent.click(button)

  const dayHeaders = queryAll(root, '[data-part="table-header"]').map(header => header.getAttribute('aria-label'))

  expect(dayHeaders).toEqual([
    'domingo',
    'lunes',
    'martes',
    'miércoles',
    'jueves',
    'viernes',
    'sábado',
  ])
})
