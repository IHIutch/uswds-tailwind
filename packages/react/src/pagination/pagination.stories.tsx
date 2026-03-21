import * as React from 'react'
import preview from '../../.storybook/preview'
import { Pagination } from './pagination'

const meta = preview.meta({
  title: 'Components/Pagination',
  component: Pagination.Root,
  argTypes: {
    currentPage: {
      control: { type: 'number', min: 1 },
    },
    pageCount: {
      control: { type: 'number', min: 1 },
    },
  },
})

export const Basic = meta.story({
  args: {
    currentPage: 1,
    pageCount: 10,
  },
  render: ({ currentPage, pageCount }) => (
    <Pagination.Root currentPage={currentPage} pageCount={pageCount}>
      <Pagination.List>
        {({ pages }) => (
          <>
            <Pagination.PrevTrigger />
            {pages.map((page, i) =>
              page.type === 'page'
                ? <Pagination.Item key={page.value} value={page.value} />
                : <Pagination.Ellipsis key={`ellipsis-${i}`} />,
            )}
            <Pagination.NextTrigger />
          </>
        )}
      </Pagination.List>
    </Pagination.Root>
  ),
})

export const Controlled = meta.story({
  render: () => {
    const [currentPage, setCurrentPage] = React.useState(3)
    return (
      <Pagination.Root currentPage={currentPage} pageCount={10} onPageChange={setCurrentPage}>
        <Pagination.List>
          <Pagination.PrevTrigger />
          <Pagination.Pages />
          <Pagination.NextTrigger />
        </Pagination.List>
      </Pagination.Root>
    )
  },
})

export const FewPages = meta.story({
  render: () => (
    <Pagination.Root pageCount={3}>
      <Pagination.List>
        <Pagination.PrevTrigger />
        <Pagination.Pages />
        <Pagination.NextTrigger />
      </Pagination.List>
    </Pagination.Root>
  ),
})

export const SevenPages = meta.story({
  render: () => (
    <Pagination.Root currentPage={4} pageCount={7}>
      <Pagination.List>
        <Pagination.PrevTrigger />
        <Pagination.Pages />
        <Pagination.NextTrigger />
      </Pagination.List>
    </Pagination.Root>
  ),
})

export const NearStart = meta.story({
  render: () => (
    <Pagination.Root currentPage={4} pageCount={8}>
      <Pagination.List>
        <Pagination.PrevTrigger />
        <Pagination.Pages />
        <Pagination.NextTrigger />
      </Pagination.List>
    </Pagination.Root>
  ),
})

export const NearEnd = meta.story({
  render: () => (
    <Pagination.Root currentPage={5} pageCount={8}>
      <Pagination.List>
        <Pagination.PrevTrigger />
        <Pagination.Pages />
        <Pagination.NextTrigger />
      </Pagination.List>
    </Pagination.Root>
  ),
})

export const Middle = meta.story({
  render: () => (
    <Pagination.Root currentPage={5} pageCount={9}>
      <Pagination.List>
        <Pagination.PrevTrigger />
        <Pagination.Pages />
        <Pagination.NextTrigger />
      </Pagination.List>
    </Pagination.Root>
  ),
})

export const Unbounded = meta.story({
  render: () => (
    <Pagination.Root>
      <Pagination.List>
        <Pagination.PrevTrigger />
        <Pagination.Pages />
        <Pagination.NextTrigger />
      </Pagination.List>
    </Pagination.Root>
  ),
})

export const AsLinks = meta.story({
  render: () => (
    <Pagination.Root currentPage={5} pageCount={10}>
      <Pagination.List>
        <Pagination.PrevTrigger />
        <Pagination.Pages
          render={props => (
            <a
              {...props}
              href={`/results?page=${props.value}`}
            >
              {props.value}
            </a>
          )}
        />
        <Pagination.NextTrigger />
      </Pagination.List>
    </Pagination.Root>
  ),
})
