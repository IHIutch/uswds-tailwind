import { expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'
import { createDisposableTable } from './_utils.js'

const ASCENDING = 'ascending'
const DESCENDING = 'descending'

const rootId = 'test'

const TEMPLATE = `
  <div data-scope="table" data-part="root" id="${rootId}">
  <table data-scope="table" data-part="table">
    <caption>Sortable table example</caption>
    <thead>
      <tr>
        <th data-part="table-header-cell" data-sortable>
          <button data-part="sort-trigger">
            Alphabetical
            <svg class="usa-icon" aria-hidden="true" focusable="false" role="img">
              <use class="ascending" xlink:href="#sort-ascending" style="fill: transparent;"></use>
              <use class="descending" xlink:href="#sort-descending" style="fill: transparent;"></use>
              <use class="unsorted" xlink:href="#sort-unsorted"></use>
            </svg>
          </button>
        </th>
        <th data-part="table-header-cell" data-sortable>
          <button data-part="sort-trigger">
            Numeric
            <svg class="usa-icon" aria-hidden="true" focusable="false" role="img">
              <use class="ascending" xlink:href="#sort-ascending" style="fill: transparent;"></use>
              <use class="descending" xlink:href="#sort-descending" style="fill: transparent;"></use>
              <use class="unsorted" xlink:href="#sort-unsorted"></use>
            </svg>
          </button>
        </th>
        <th data-part="table-header-cell" data-sortable>
          <button data-part="sort-trigger">
            Data Value
            <svg class="usa-icon" aria-hidden="true" focusable="false" role="img">
              <use class="ascending" xlink:href="#sort-ascending" style="fill: transparent;"></use>
              <use class="descending" xlink:href="#sort-descending" style="fill: transparent;"></use>
              <use class="unsorted" xlink:href="#sort-unsorted"></use>
            </svg>
          </button>
        </th>
        <th data-part="table-header-cell">Unsortable</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td data-part="table-body-cell">Z</td>
        <td data-part="table-body-cell">2</td>
        <td data-part="table-body-cell" data-sort-value="2000">2,000</td>
        <td>Row 1</td>
      </tr>
      <tr>
        <td data-part="table-body-cell">Y</td>
        <td data-part="table-body-cell">3</td>
        <td data-part="table-body-cell" data-sort-value="0">Zero</td>
        <td>Row 2</td>
      </tr>
      <tr>
        <td data-part="table-body-cell">X</td>
        <td data-part="table-body-cell">1</td>
        <td data-part="table-body-cell" data-sort-value="0.25">25%</td>
        <td>Row 3</td>
      </tr>
      <tr>
        <td data-part="table-body-cell">A</td>
        <td data-part="table-body-cell">4</td>
        <td data-part="table-body-cell" data-sort-value="-1">-1</td>
        <td>Row 4</td>
      </tr>
    </tbody>
  </table>
  <div data-scope="table" data-part="sr-status" id="table:${rootId}:sr-status"></div>
  </div>
`

function getCellValuesByColumn(tbody: HTMLElement, index: number) {
  return Array.from(tbody.querySelectorAll('tr')).map(
    row => row.children[index].innerHTML,
  )
}

it('is immediately followed by an "aria-live" region', async () => {
  await using component = createDisposableTable(rootId, TEMPLATE)
  const root = component.elements.getRootEl()!
  const sortableHeaders = root.querySelectorAll('th[data-sortable]')
  const alphabeticalSortButton = sortableHeaders[0].querySelector('button')!

  await userEvent.click(alphabeticalSortButton)
  const ariaLive = component.elements.getSrStatusEl()
  expect(ariaLive).toBeTruthy()
  expect(root.querySelector('table')?.nextElementSibling).toBe(ariaLive)
})

it('has at least one sortable column', async () => {
  await using component = createDisposableTable(rootId, TEMPLATE)
  const root = component.elements.getRootEl()!
  const sortableHeaders = root.querySelectorAll('th[data-sortable]')
  expect(sortableHeaders[0]).toBeTruthy()
})

it('sorts rows by cell content alphabetically when clicked', async () => {
  await using component = createDisposableTable(rootId, TEMPLATE)
  const root = component.elements.getRootEl()!
  const tbody = root.querySelector('tbody')!
  const sortableHeaders = root.querySelectorAll('th[data-sortable]')
  const alphabeticalSortButton = sortableHeaders[0].querySelector('button')!

  await userEvent.click(alphabeticalSortButton)
  expect(getCellValuesByColumn(tbody, 0)).toEqual(['A', 'X', 'Y', 'Z'])
})

it('sorts rows by cell content numerically when clicked', async () => {
  await using component = createDisposableTable(rootId, TEMPLATE)
  const root = component.elements.getRootEl()!
  const tbody = root.querySelector('tbody')!
  const sortableHeaders = root.querySelectorAll('th[data-sortable]')
  const numericSortButton = sortableHeaders[1].querySelector('button')!

  await userEvent.click(numericSortButton)
  expect(getCellValuesByColumn(tbody, 1)).toEqual(['1', '2', '3', '4'])
})

it('sorts rows by "data-sort-value" attribute on cells when clicked', async () => {
  await using component = createDisposableTable(rootId, TEMPLATE)
  const root = component.elements.getRootEl()!
  const tbody = root.querySelector('tbody')!
  const sortableHeaders = root.querySelectorAll('th[data-sortable]')
  const dataSortValueSortButton = sortableHeaders[2].querySelector('button')!

  await userEvent.click(dataSortValueSortButton)
  expect(getCellValuesByColumn(tbody, 2)).toEqual(['-1', 'Zero', '25%', '2,000'])
})

it('sorts rows descending if already sorted ascending when clicked', async () => {
  await using component = createDisposableTable(rootId, TEMPLATE)
  const root = component.elements.getRootEl()!
  const tbody = root.querySelector('tbody')!
  const sortableHeaders = root.querySelectorAll('th[data-sortable]')
  const alphabeticalSortButton = sortableHeaders[0].querySelector('button')!

  await userEvent.click(alphabeticalSortButton)
  expect(getCellValuesByColumn(tbody, 0)).toEqual(['A', 'X', 'Y', 'Z'])
  expect(sortableHeaders[0].getAttribute('aria-sort')).toBe(ASCENDING)

  await userEvent.click(alphabeticalSortButton)
  expect(getCellValuesByColumn(tbody, 0)).toEqual(['Z', 'Y', 'X', 'A'])
  expect(sortableHeaders[0].getAttribute('aria-sort')).toBe(DESCENDING)
})

it('announces sort direction when sort changes', async () => {
  await using component = createDisposableTable(rootId, TEMPLATE)
  const root = component.elements.getRootEl()!
  const sortableHeaders = root.querySelectorAll('th[data-sortable]')
  const alphabeticalSortButton = sortableHeaders[0].querySelector('button')!

  await userEvent.click(alphabeticalSortButton)
  // Give time for the aria-live announcement
  await new Promise(resolve => setTimeout(resolve, 150))
  const ariaLive = component.elements.getSrStatusEl()
  expect(ariaLive).toBeTruthy()
  expect(ariaLive.textContent!.length > 0).toBe(true)
})

it('has an aria-label that describes the current sort direction', async () => {
  await using component = createDisposableTable(rootId, TEMPLATE)
  const root = component.elements.getRootEl()!
  const sortableHeaders = root.querySelectorAll('th[data-sortable]')
  const alphabeticalSortButton = sortableHeaders[0].querySelector('button')!

  expect(sortableHeaders[0].getAttribute('aria-label')).toBe('Alphabetical, sortable column, currently unsorted')
  await userEvent.click(alphabeticalSortButton)
  expect(sortableHeaders[0].getAttribute('aria-label')).toBe('Alphabetical, sortable column, currently sorted ascending')
  await userEvent.click(alphabeticalSortButton)
  expect(sortableHeaders[0].getAttribute('aria-label')).toBe('Alphabetical, sortable column, currently sorted descending')
})

it('has sort button with a title that describes what the sort direction will be if clicked', async () => {
  await using component = createDisposableTable(rootId, TEMPLATE)
  const root = component.elements.getRootEl()!
  const sortableHeaders = root.querySelectorAll('th[data-sortable]')
  const alphabeticalSortButton = sortableHeaders[0].querySelector('button')!

  expect(alphabeticalSortButton.getAttribute('title')).toBe('Click to sort by Alphabetical in ascending order.')
  await userEvent.click(alphabeticalSortButton)
  expect(alphabeticalSortButton.getAttribute('title')).toBe('Click to sort by Alphabetical in descending order.')
  await userEvent.click(alphabeticalSortButton)
  expect(alphabeticalSortButton.getAttribute('title')).toBe('Click to sort by Alphabetical in ascending order.')
})

it('marks cells in the sorted column as active', async () => {
  await using component = createDisposableTable(rootId, TEMPLATE)
  const root = component.elements.getRootEl()!
  const sortableHeaders = root.querySelectorAll('th[data-sortable]')
  const alphabeticalSortButton = sortableHeaders[0].querySelector('button')!

  await userEvent.click(alphabeticalSortButton)
  const rows = Array.from(root.querySelectorAll('tbody tr'))
  expect(rows.every(row => row.children[0].getAttribute('data-sort-active') === 'true')).toBe(true)
  expect(rows.every(row => !row.children[1].hasAttribute('data-sort-active'))).toBe(true)

  await userEvent.click(sortableHeaders[1].querySelector('button')!)
  expect(rows.every(row => !row.children[0].hasAttribute('data-sort-active'))).toBe(true)
  expect(rows.every(row => row.children[1].getAttribute('data-sort-active') === 'true')).toBe(true)
})

it('does not have a sort button', async () => {
  await using component = createDisposableTable(rootId, TEMPLATE)
  const root = component.elements.getRootEl()!
  const unsortableHeader = root.querySelector('th:not([data-sortable])')
  const unsortableHeaderButton = unsortableHeader?.querySelector('button')
  expect(unsortableHeaderButton).toBe(null)
})
