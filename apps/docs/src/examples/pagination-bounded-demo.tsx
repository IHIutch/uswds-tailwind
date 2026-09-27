import { Pagination } from '@uswds-tailwind/react/pagination'

export default function PaginationBoundedDemo() {
  return (
    <Pagination.Root currentPage={6} pageCount={8}>
      <Pagination.List>
        <Pagination.PrevTrigger />
        <Pagination.Pages />
        <Pagination.NextTrigger />
      </Pagination.List>
    </Pagination.Root>
  )
}
