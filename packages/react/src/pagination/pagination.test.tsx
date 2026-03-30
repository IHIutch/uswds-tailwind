import { expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-react'
import { Pagination } from './pagination'

function renderPagination(props: { currentPage?: number, pageCount?: number, onPageChange?: (page: number) => void } = {}) {
  const { currentPage = 1, pageCount = 10, onPageChange } = props
  return render(
    <Pagination.Root currentPage={currentPage} pageCount={pageCount} onPageChange={onPageChange}>
      <Pagination.List>
        <Pagination.PrevTrigger />
        <Pagination.Pages />
        <Pagination.NextTrigger />
      </Pagination.List>
    </Pagination.Root>,
  )
}

it('renders navigation with page buttons', async () => {
  const screen = await renderPagination()

  await expect.element(screen.getByRole('navigation')).toBeVisible()
  await expect.element(screen.getByRole('button', { name: /^Page 1$/ })).toBeVisible()
  await expect.element(screen.getByRole('button', { name: 'Last page, page 10' })).toBeVisible()
})

it('current page has aria-current="page"', async () => {
  const screen = await renderPagination({ currentPage: 3 })

  await expect.element(screen.getByRole('button', { name: /^Page 3$/ })).toHaveAttribute('aria-current', 'page')
  await expect.element(screen.getByRole('button', { name: /^Page 1$/ })).not.toHaveAttribute('aria-current')
})

it('clicking a page button calls onPageChange', async () => {
  const onPageChange = vi.fn()
  const screen = await renderPagination({ currentPage: 1, onPageChange })

  await screen.getByRole('button', { name: /^Page 2$/ }).click()

  expect(onPageChange).toHaveBeenCalledWith(2)
})

// TODO: Next button interaction needs investigation
it.skip('clicking next calls onPageChange with next page', async () => {
  const onPageChange = vi.fn()
  const screen = await renderPagination({ currentPage: 3, pageCount: 10, onPageChange })

  await screen.getByRole('button', { name: /next/i }).click()

  expect(onPageChange).toHaveBeenCalledWith(4)
})
