import { expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'
import { createDisposableTable } from './_utils.js'

const rootId = 'test'

const TEMPLATE = `
  <form>
    <div data-scope="table" data-part="root" id="${rootId}">
      <table data-scope="table" data-part="table">
        <caption>People</caption>
        <thead><tr><th data-sortable>Name<button></button></th></tr></thead>
        <tbody id="table:${rootId}:tbody"><tr><td>Bob</td></tr><tr><td>Alice</td></tr></tbody>
      </table>
      <div data-scope="table" data-part="sr-status" id="table:${rootId}:sr-status"></div>
    </div>
  </form>
`

// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-table/src/index.js#L192-L194 (the sort button has no type, so it defaults to submit)
// https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-table/src/index.js#L217-L223 (clicking it prevents the default action and sorts)
it('sorts without submitting the surrounding form', { tags: ['parity'] }, async () => {
  await using component = createDisposableTable(rootId, TEMPLATE)
  const { getHeaderEl, getSortButtonEl, getTbodyEl } = component.elements
  const submissions: Array<HTMLElement | null> = []
  document.querySelector('form')!.addEventListener('submit', (event) => {
    submissions.push(event.submitter)
    event.preventDefault()
  })

  await userEvent.click(getSortButtonEl(0)!)

  await expect.element(getHeaderEl(0)).toHaveAttribute('aria-sort', 'ascending')
  await expect.element(getTbodyEl().rows[0]!).toHaveTextContent('Alice')
  expect(submissions).toEqual([])
})
