import preview from '../../.storybook/preview'
import { Input } from '../input/input'
import { InputGroup } from './input-group'

const meta = preview.meta({
  title: 'Components/Input Group',
  component: () => <InputGroup />,
})

export const StartElement = meta.story({
  render: () => (
    <InputGroup
      className="max-w-xs"
      startElement={(
        <div
          aria-hidden="true"
          className="select-none pointer-events-none absolute left-0 whitespace-nowrap px-2 text-gray-50 flex items-center"
        >
          <div className="icon-[material-symbols--credit-card-outline] size-6"></div>
        </div>
      )}
    >
      <Input />
    </InputGroup>
  ),
})

export const EndElement = meta.story({
  render: () => (
    <InputGroup
      className="max-w-28"
      endElement={(
        <div
          aria-hidden="true"
          className="select-none pointer-events-none absolute right-0 whitespace-nowrap px-2 text-gray-50"
        >
          lbs.
        </div>
      )}
    >
      <Input />
    </InputGroup>
  ),
})
