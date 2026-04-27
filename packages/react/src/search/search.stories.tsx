import preview from '../../.storybook/preview'
import { Field } from '../field/field'
import { Search } from './search'

const meta = preview.meta({
  title: 'Components/Search',
  component: Search.Root,
  argTypes: {
    size: {
      control: 'select',
      options: [undefined, 'sm', 'lg'],
      table: {
        defaultValue: {
          summary: 'sm',
        },
      },
    },
  },
})

export const Default = meta.story({
  args: {
    size: undefined,
  },
  render: ({ size }) => (
    <Field.Root>
      <Field.Label>Search</Field.Label>
      <Search.Root size={size}>
        <Search.Input />
        <Search.Button>Search</Search.Button>
      </Search.Root>
    </Field.Root>
  ),
})

export const Large = meta.story({
  render: () => (
    <Field.Root>
      <Search.Root size="lg">
        <Search.Label>Search</Search.Label>
        <Search.Input />
        <Search.Button>Search</Search.Button>
      </Search.Root>
    </Field.Root>
  ),
})

export const IconButton = meta.story({
  render: () => (
    <Field.Root>
      <Search.Root size="sm">
        <Search.Label>Search</Search.Label>
        <Search.Input />
        <Search.Button aria-label="Search" />
      </Search.Root>
    </Field.Root>
  ),
})
