import { Pagination } from '@uswds-tailwind/react/pagination'

export default function PaginationUnboundedDemo() {
  return (
    <Pagination.Root currentPage={6}>
      <Pagination.List>
        <Pagination.PrevTrigger />
        <Pagination.Pages />
        <Pagination.NextTrigger />
      </Pagination.List>
    </Pagination.Root>
  )
}
