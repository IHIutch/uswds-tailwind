import { Pagination } from '@uswds-tailwind/react/pagination'

export default function PaginationBoundedDemo() {
  return (
    <Pagination.Root currentPage={6} pageCount={8}>
      <Pagination.List>
        {({ pages }) => (
          <>
            <Pagination.PrevTrigger />
            {pages.map((page, index) =>
              page.type === 'page'
                ? <Pagination.Item key={page.value} value={page.value} />
                : <Pagination.Ellipsis key={`ellipsis-${index}`} />,
            )}
            <Pagination.NextTrigger />
          </>
        )}
      </Pagination.List>
    </Pagination.Root>
  )
}
