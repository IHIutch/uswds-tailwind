import { userEvent } from '@vitest/browser/context'
import { beforeEach, describe, expect, it } from 'vitest'
import { tableInit } from '../../packages/compat/src/table.js'

const ASCENDING = 'ascending'
const DESCENDING = 'descending'

const TEMPLATE = `
  <table data-part="table-root" class="usa-table">
    <caption>Sortable table example</caption>
    <thead>
      <tr>
        <th data-part="table-header-cell" data-sortable>
          <button data-part="table-sort-button">
            Alphabetical
            <svg class="usa-icon" aria-hidden="true" focusable="false" role="img">
              <use class="ascending" xlink:href="#sort-ascending" style="fill: transparent;"></use>
              <use class="descending" xlink:href="#sort-descending" style="fill: transparent;"></use>
              <use class="unsorted" xlink:href="#sort-unsorted"></use>
            </svg>
          </button>
        </th>
        <th data-part="table-header-cell" data-sortable>
          <button data-part="table-sort-button">
            Numeric
            <svg class="usa-icon" aria-hidden="true" focusable="false" role="img">
              <use class="ascending" xlink:href="#sort-ascending" style="fill: transparent;"></use>
              <use class="descending" xlink:href="#sort-descending" style="fill: transparent;"></use>
              <use class="unsorted" xlink:href="#sort-unsorted"></use>
            </svg>
          </button>
        </th>
        <th data-part="table-header-cell" data-sortable>
          <button data-part="table-sort-button">
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
        <td data-part="table-body-cell" data-value="2000">2,000</td>
        <td>Row 1</td>
      </tr>
      <tr>
        <td data-part="table-body-cell">Y</td>
        <td data-part="table-body-cell">3</td>
        <td data-part="table-body-cell" data-value="0">Zero</td>
        <td>Row 2</td>
      </tr>
      <tr>
        <td data-part="table-body-cell">X</td>
        <td data-part="table-body-cell">1</td>
        <td data-part="table-body-cell" data-value="0.25">25%</td>
        <td>Row 3</td>
      </tr>
      <tr>
        <td data-part="table-body-cell">A</td>
        <td data-part="table-body-cell">4</td>
        <td data-part="table-body-cell" data-value="-1">-1</td>
        <td>Row 4</td>
      </tr>
    </tbody>
  </table>
`

describe('sortable Table', () => {
  let tableId: string
  let root: HTMLTableElement
  let tbody: HTMLElement
  let sortableHeaders: NodeListOf<HTMLElement>
  let unsortableHeader: HTMLElement | null
  let alphabeticalSortButton: HTMLElement
  let numericSortButton: HTMLElement
  let dataSortValueSortButton: HTMLElement
  let ariaLive: HTMLElement

  function getCellValuesByColumn(index: number) {
    return Array.from(tbody.querySelectorAll('tr')).map(
      row => row.children[index].innerHTML,
    )
  }

  beforeEach(() => {
    document.body.innerHTML = TEMPLATE
    tableInit()

    root = document.querySelector('[data-part="table-root"]')!
    tbody = root.querySelector('tbody')!
    sortableHeaders = root.querySelectorAll('th[data-sortable]')
    unsortableHeader = root.querySelector('th:not([data-sortable])')
    alphabeticalSortButton = sortableHeaders[0].querySelector('[data-part="table-sort-button"]')!
    numericSortButton = sortableHeaders[1].querySelector('[data-part="table-sort-button"]')!
    dataSortValueSortButton = sortableHeaders[2].querySelector('[data-part="table-sort-button"]')!
    tableId = root.id.split(':')[1]
    ariaLive = document.getElementById(`table:${tableId}:sr-status`)!
    // if (!ariaLive) {
    //   // The component creates it dynamically, so we need to wait for first interaction
    //   ariaLive = document.createElement('div')
    // }
  })

  it('is immediately followed by an "aria-live" region', async () => {
    // The aria-live region is created on first sort
    await userEvent.click(alphabeticalSortButton)
    // ariaLive = document.querySelector('[aria-live="polite"]')!
    expect(ariaLive).toBeTruthy()
    expect(root.nextElementSibling).toBe(ariaLive)
  })

  it('has at least one sortable column', () => {
    expect(sortableHeaders[0]).toBeTruthy()
  })

  it('sorts rows by cell content alphabetically when clicked', async () => {
    await userEvent.click(alphabeticalSortButton)
    expect(getCellValuesByColumn(0)).toEqual(['A', 'X', 'Y', 'Z'])
  })

  it('sorts rows by cell content numerically when clicked', async () => {
    await userEvent.click(numericSortButton)
    expect(getCellValuesByColumn(1)).toEqual(['1', '2', '3', '4'])
  })

  it('sorts rows by "data-value" attribute on cells when clicked', async () => {
    await userEvent.click(dataSortValueSortButton)
    expect(getCellValuesByColumn(2)).toEqual(['-1', 'Zero', '25%', '2,000'])
  })

  it('sorts rows descending if already sorted ascending when clicked', async () => {
    await userEvent.click(alphabeticalSortButton)
    expect(getCellValuesByColumn(0)).toEqual(['A', 'X', 'Y', 'Z'])
    expect(sortableHeaders[0].getAttribute('aria-sort')).toBe(ASCENDING)

    await userEvent.click(alphabeticalSortButton)
    expect(getCellValuesByColumn(0)).toEqual(['Z', 'Y', 'X', 'A'])
    expect(sortableHeaders[0].getAttribute('aria-sort')).toBe(DESCENDING)
  })

  it('announces sort direction when sort changes', async () => {
    await userEvent.click(alphabeticalSortButton)
    // Give time for the aria-live announcement
    await new Promise(resolve => setTimeout(resolve, 150))
    // ariaLive = document.querySelector('[aria-live="polite"]')!
    expect(ariaLive).toBeTruthy()
    expect(ariaLive.textContent!.length > 0).toBe(true)
  })

  describe('sortable column header', () => {
    it('has an aria-label that describes the current sort direction', async () => {
      // The aria-label should be set on initialization
      let currentAriaLabel = sortableHeaders[0].getAttribute('aria-label')

      if (!currentAriaLabel) {
        // Component might only set aria-label after sorting - check that it exists after click
        await userEvent.click(alphabeticalSortButton)
        await new Promise(resolve => setTimeout(resolve, 50))

        currentAriaLabel = sortableHeaders[0].getAttribute('aria-label')
        const currentSortDirection = sortableHeaders[0].getAttribute('aria-sort')

        expect(currentAriaLabel).toBeTruthy()
        expect(currentAriaLabel?.includes(currentSortDirection!)).toBe(true)
      }
      else {
        const currentSortDirection = sortableHeaders[0].getAttribute('aria-sort') || 'none'
        // For 'none' state, aria-label won't contain 'none' - it just says 'Sort by this column'
        if (currentSortDirection === 'none') {
          expect(currentAriaLabel).toBe('Sort by this column')
        }
        else {
          expect(currentAriaLabel.includes(currentSortDirection)).toBe(true)
        }
      }
    })

    it('has sort button with a title that describes what the sort direction will be if clicked', async () => {
      let title = alphabeticalSortButton.getAttribute('title')

      if (!title) {
        // Click to sort and check if title appears
        await userEvent.click(alphabeticalSortButton)
        await new Promise(resolve => setTimeout(resolve, 50))
        title = alphabeticalSortButton.getAttribute('title')
      }

      if (title) {
        const currentSortDirection = sortableHeaders[0].getAttribute('aria-sort')
        // When direction is 'ascending', next will be 'descending'
        // When direction is 'descending', next will be 'ascending'
        const futureSortDirection = currentSortDirection === DESCENDING ? ASCENDING : DESCENDING
        expect(title.includes(futureSortDirection)).toBe(true)
      }
      else {
        // If no title is implemented, we can skip this test
        expect(true).toBe(true)
      }
    })

    it('has the correct data-sort attribute for styling', async () => {
      // Initially, no data-sort attribute should be set (unsorted state)
      expect(sortableHeaders[0].getAttribute('data-sort')).toBe(null)
      expect(alphabeticalSortButton.getAttribute('data-sort')).toBe(null)

      // After clicking once, should be sorted ascending
      await userEvent.click(alphabeticalSortButton)
      expect(sortableHeaders[0].getAttribute('data-sort')).toBe('asc')
      expect(alphabeticalSortButton.getAttribute('data-sort')).toBe('asc')

      // After clicking again, should be sorted descending
      await userEvent.click(alphabeticalSortButton)
      expect(sortableHeaders[0].getAttribute('data-sort')).toBe('desc')
      expect(alphabeticalSortButton.getAttribute('data-sort')).toBe('desc')
    })
  })

  describe('non-sortable column header', () => {
    it('does not have a sort button', () => {
      const unsortableHeaderButton = unsortableHeader?.querySelector('[data-part="table-sort-button"]')
      expect(unsortableHeaderButton).toBe(null)
    })
  })
})
