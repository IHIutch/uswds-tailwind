import { expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { createDisposableTable } from './_utils'

const rootId = 'test'

const TEMPLATE = `
  <div id="${rootId}" data-scope="table" data-part="root">
  <table data-scope="table" data-part="table">
    <caption>People</caption>
    <thead><tr><th data-sortable>Name<button></button></th><th data-sortable>Age<button></button></th></tr></thead>
    <tbody id="table:${rootId}:tbody">
      <tr data-row-key="charlie"><td>Charlie</td><td>30</td></tr>
      <tr data-row-key="alice"><td>Alice</td><td>40</td></tr>
      <tr data-row-key="bob"><td>Bob</td><td>20</td></tr>
    </tbody>
  </table>
  <div data-scope="table" data-part="sr-status" id="table:${rootId}:sr-status"></div>
  </div>
`

const DATA_TEMPLATE = `
  <div id="table:${rootId}" data-scope="table" data-part="root">
  <table data-scope="table" data-part="table">
    <caption>Months</caption>
    <thead><tr><th data-sortable>Month<button></button></th></tr></thead>
    <tbody id="table:${rootId}:tbody">
      <tr data-row-key="march"><td data-sort-value="3">March</td></tr>
      <tr data-row-key="january"><td data-sort="1">January</td></tr>
      <tr data-row-key="february"><td data-sort-value="2">February</td></tr>
    </tbody>
  </table>
  <div data-scope="table" data-part="sr-status" id="table:${rootId}:sr-status"></div>
  </div>
`

function names(tbody: HTMLTableSectionElement) {
  return Array.from(tbody.rows).map(row => row.cells[0]!.textContent)
}

it('starts with the sort declared on the vanilla root', { tags: ['new'] }, async () => {
  const template = TEMPLATE.replace('data-part="root"', 'data-part="root" data-sort-column="1" data-sort-direction="descending"')
  await using component = createDisposableTable(rootId, template)

  await vi.waitFor(() => expect(names(component.elements.getTbodyEl())).toEqual(['Alice', 'Charlie', 'Bob']))
  expect(component.elements.getHeaderEl(1).getAttribute('aria-sort')).toBe('descending')
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-table/src/index.js#L228-L246
// USWDS flips the declared direction during initialization. Preserving it is an addition here.
it('starts with the sort declared on a header', { tags: ['new'] }, async () => {
  const template = TEMPLATE.replace('<th data-sortable>Age', '<th data-sortable aria-sort="descending">Age')
  await using component = createDisposableTable(rootId, template)

  await vi.waitFor(() => expect(names(component.elements.getTbodyEl())).toEqual(['Alice', 'Charlie', 'Bob']))
  expect(component.elements.getHeaderEl(1).getAttribute('aria-sort')).toBe('descending')
})

// defaultSortDescriptor is a public addition; USWDS has no equivalent prop.
it.each([
  { defaultSortDescriptor: null, expected: ['Charlie', 'Alice', 'Bob'], ariaSort: null },
  { defaultSortDescriptor: { column: 0, direction: 'ascending' as const }, expected: ['Alice', 'Bob', 'Charlie'], ariaSort: 'ascending' },
])('lets defaultSortDescriptor=$defaultSortDescriptor override the sort declared in markup', { tags: ['new'] }, async ({ defaultSortDescriptor, expected, ariaSort }) => {
  const template = TEMPLATE.replace('data-part="root"', 'data-part="root" data-sort-column="1" data-sort-direction="descending"')
  await using component = createDisposableTable(rootId, template, { id: rootId, defaultSortDescriptor })

  await vi.waitFor(() => expect(names(component.elements.getTbodyEl())).toEqual(expected))
  expect(component.elements.getHeaderEl(0).getAttribute('aria-sort')).toBe(ariaSort)
  expect(component.elements.getHeaderEl(1).hasAttribute('aria-sort')).toBe(false)
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-table/src/index.js#L36-L55 (locale comparison ignores punctuation)
// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-table/src/index.js#L122-L132 (sorts the current row order)
it('keeps punctuation-only sort ties in their current order', { tags: ['parity'] }, async () => {
  const template = TEMPLATE.replace('<td>Charlie</td>', '<td>AB</td>').replace('<td>Alice</td>', '<td>A-B</td>')
  await using component = createDisposableTable(rootId, template)

  await userEvent.click(component.elements.getSortButtonEl(0)!)
  await vi.waitFor(() => expect(component.elements.getHeaderEl(0).getAttribute('aria-sort')).toBe('ascending'))
  expect(names(component.elements.getTbodyEl())).toEqual(['AB', 'A-B', 'Bob'])
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-table/src/index.js#L107-L132 (sorting sets the active column and reorders rows)
// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-table/src/index.js#L73-L89 (header label and next-sort title)
// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-table/src/index.js#L143-L152 (sort announcement)
// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-table/src/index.js#L168-L184 (switching columns resets the previous header)
it('sorts visible rows and resets the previous column when a different header is clicked', { tags: ['parity'] }, async () => {
  await using component = createDisposableTable(rootId, TEMPLATE, { id: rootId })
  const { getHeaderEl, getSortButtonEl, getTbodyEl, getSrStatusEl } = component.elements
  const tbody = getTbodyEl()

  await userEvent.click(getSortButtonEl(0)!)
  await vi.waitFor(() => expect(names(tbody)).toEqual(['Alice', 'Bob', 'Charlie']))
  expect(getHeaderEl(0).getAttribute('aria-sort')).toBe('ascending')
  expect(getSrStatusEl().textContent).toBe('The table named "People" is now sorted by Name in ascending order.')

  await userEvent.click(getSortButtonEl(1)!)
  await vi.waitFor(() => expect(names(tbody)).toEqual(['Bob', 'Charlie', 'Alice']))
  expect(getHeaderEl(0).hasAttribute('aria-sort')).toBe(false)
  expect(getHeaderEl(0).getAttribute('aria-label')).toBe('Name, sortable column, currently unsorted')
  expect(getSortButtonEl(0)!.title).toBe('Click to sort by Name in ascending order.')
  expect(getHeaderEl(1).getAttribute('aria-sort')).toBe('ascending')
  expect(Array.from(tbody.rows).every(row => !row.cells[0]!.hasAttribute('data-sort-active') && row.cells[1]!.getAttribute('data-sort-active') === 'true')).toBe(true)
  expect(getSrStatusEl().textContent).toBe('The table named "People" is now sorted by Age in ascending order.')

  await userEvent.click(getSortButtonEl(1)!)
  await vi.waitFor(() => expect(names(tbody)).toEqual(['Alice', 'Charlie', 'Bob']))
  expect(getHeaderEl(1).getAttribute('aria-sort')).toBe('descending')
  expect(getSortButtonEl(1)!.title).toBe('Click to sort by Age in ascending order.')
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-table/src/index.js#L25-L28 (data-sort-value takes precedence over visible cell text)
// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-table/src/index.js#L122-L132 (sorting the current row order preserves ties)
it('uses a cell sort value before its visible text and retains tied rows in their current order', { tags: ['parity'] }, async () => {
  await using component = createDisposableTable(rootId, TEMPLATE, { id: rootId })
  const { getHeaderEl, getSortButtonEl, getTbodyEl } = component.elements
  const tbody = getTbodyEl()

  tbody.rows[0]!.cells[1]!.setAttribute('data-sort-value', '20')
  tbody.rows[2]!.cells[1]!.setAttribute('data-sort-value', '20')
  await userEvent.click(getSortButtonEl(0)!)
  await vi.waitFor(() => expect(names(tbody)).toEqual(['Alice', 'Bob', 'Charlie']))
  await userEvent.click(getSortButtonEl(0)!)
  await vi.waitFor(() => expect(names(tbody)).toEqual(['Charlie', 'Bob', 'Alice']))
  await userEvent.click(getSortButtonEl(1)!)
  await vi.waitFor(() => expect(getHeaderEl(1).getAttribute('aria-sort')).toBe('ascending'))
  expect(names(tbody)).toEqual(['Charlie', 'Bob', 'Alice'])
  expect(Array.from(tbody.rows).map(row => row.cells[1]!.textContent)).toEqual(['30', '20', '40'])
})

// Controlled props and onSortChange are public additions to the USWDS table behavior.
it('keeps a refused controlled sort request out of the rendered order and announcement', { tags: ['new'] }, async () => {
  const onSortChange = vi.fn()
  await using component = createDisposableTable(rootId, TEMPLATE, { id: rootId, sortDescriptor: { column: 0, direction: 'ascending' }, onSortChange })
  const { getHeaderEl, getSortButtonEl, getTbodyEl, getSrStatusEl } = component.elements
  const tbody = getTbodyEl()

  await vi.waitFor(() => expect(names(tbody)).toEqual(['Alice', 'Bob', 'Charlie']))
  await userEvent.click(getSortButtonEl(0)!)
  await vi.waitFor(() => expect(onSortChange).toHaveBeenCalledOnce())
  expect(onSortChange).toHaveBeenCalledWith({ sortDescriptor: { column: 0, direction: 'descending' } })
  expect(getHeaderEl(0).getAttribute('aria-sort')).toBe('ascending')
  expect(names(tbody)).toEqual(['Alice', 'Bob', 'Charlie'])
  expect(getSrStatusEl().textContent).toBe('The table named "People" is now sorted by Name in ascending order.')
})

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-table/src/index.js#L25-L55 (cell sort values)
it('sorts vanilla rows by their override value and preserves row order when clearing the sort', { tags: ['new'] }, async () => {
  const onSortChange = vi.fn()
  await using component = createDisposableTable(rootId, DATA_TEMPLATE, { id: rootId, captionText: 'Months', onSortChange })
  const api = () => component.elements.getInstance()!.api
  const tbody = component.elements.getTbodyEl()

  api().setSortDescriptor({ column: 0, direction: 'ascending' })
  await vi.waitFor(() => expect(names(tbody)).toEqual(['January', 'February', 'March']))
  expect(component.elements.getSrStatusEl().textContent).toBe('The table named "Months" is now sorted by Month in ascending order.')
  expect(onSortChange).toHaveBeenLastCalledWith({ sortDescriptor: { column: 0, direction: 'ascending' } })

  api().setSortDescriptor({ column: 0, direction: 'descending' })
  await vi.waitFor(() => expect(names(tbody)).toEqual(['March', 'February', 'January']))
  expect(component.elements.getHeaderEl(0).getAttribute('aria-sort')).toBe('descending')
  expect(onSortChange).toHaveBeenLastCalledWith({ sortDescriptor: { column: 0, direction: 'descending' } })

  api().setSortDescriptor(null)
  await vi.waitFor(() => expect(api().sortDescriptor).toBeNull())
  expect(names(tbody)).toEqual(['March', 'February', 'January'])
  expect(component.elements.getHeaderEl(0).hasAttribute('aria-sort')).toBe(false)
  expect(component.elements.getSrStatusEl().textContent).toBe('')
  expect(onSortChange).toHaveBeenLastCalledWith({ sortDescriptor: null })
  expect(onSortChange).toHaveBeenCalledTimes(3)
})
