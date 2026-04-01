import preview from '../../.storybook/preview'
import { Button } from '../button'
import { Card } from './card'

const meta = preview.meta({
  title: 'Components/Card',
  component: Card.Root,
  argTypes: {
    layout: {
      control: 'select',
      options: ['vertical', 'ltr', 'rtl'],
      table: {
        defaultValue: { summary: 'default' },
      },
    },
    variant: {
      control: 'select',
      options: ['indent', 'exdent', 'flush'],
      table: {
        defaultValue: { summary: 'default' },
      },
    },
  },
})

export const Default = meta.story({
  args: {
    layout: 'vertical',
    variant: 'indent',
  },
  render: ({ layout, variant }) => (
    <Card.Root layout={layout}>
      <Card.Media variant={variant}>
        <img className="size-full object-cover" src="https://designsystem.digital.gov/img/introducing-uswds-2-0/built-to-grow--alt.jpg" alt="Placeholder" />
      </Card.Media>
      <Card.Header>
        <Card.Title>Card title</Card.Title>
      </Card.Header>
      <Card.Body>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Facilis earum tenetur quo.</p>
      </Card.Body>
      <Card.Footer>
        <Button>Visit agency</Button>
      </Card.Footer>
    </Card.Root>
  ),
})

export const WithMedia = meta.story({
  render: () => (
    <Card.Root>
      <Card.Media variant="flush">
        <img className="size-full object-cover" src="https://designsystem.digital.gov/img/introducing-uswds-2-0/built-to-grow--alt.jpg" alt="Placeholder" />
      </Card.Media>
      <Card.Header>
        <Card.Title>Card title</Card.Title>
      </Card.Header>
      <Card.Body>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Facilis earum tenetur quo.</p>
      </Card.Body>
      <Card.Footer>
        <Button>Visit agency</Button>
      </Card.Footer>
    </Card.Root>
  ),
})

export const WithHeaderFirst = meta.story({
  render: () => (
    <Card.Root>
      <Card.Media variant="exdent" className="order-0 py-2">
        <img className="size-full object-cover" src="https://designsystem.digital.gov/img/introducing-uswds-2-0/built-to-grow--alt.jpg" alt="Placeholder" />
      </Card.Media>
      <Card.Header className="order-first">
        <Card.Title>Card title</Card.Title>
      </Card.Header>
      <Card.Body>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Facilis earum tenetur quo.</p>
      </Card.Body>
      <Card.Footer>
        <Button>Visit agency</Button>
      </Card.Footer>
    </Card.Root>
  ),
})

export const Horizontal_LTR = meta.story({
  render: () => (
    <Card.Root layout="ltr">
      <Card.Media>
        <img className="size-full object-cover" src="https://designsystem.digital.gov/img/introducing-uswds-2-0/built-to-grow--alt.jpg" alt="Placeholder" />
      </Card.Media>
      <Card.Header>
        <Card.Title>Card title</Card.Title>
      </Card.Header>
      <Card.Body>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Facilis earum tenetur quo.</p>
      </Card.Body>
      <Card.Footer>
        <Button>Visit agency</Button>
      </Card.Footer>
    </Card.Root>
  ),
})

export const Horizontal_RTL = meta.story({
  render: () => (
    <Card.Root layout="rtl">
      <Card.Media>
        <img className="size-full object-cover" src="https://designsystem.digital.gov/img/introducing-uswds-2-0/built-to-grow--alt.jpg" alt="Placeholder" />
      </Card.Media>
      <div>
        <Card.Header>
          <Card.Title>Card title</Card.Title>
        </Card.Header>
        <Card.Body>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Facilis earum tenetur quo.</p>
        </Card.Body>
        <Card.Footer>
          <Button>Visit agency</Button>
        </Card.Footer>
      </div>
    </Card.Root>
  ),
})

export const Group = meta.story({
  render: () => (
    <Card.Group className="grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-3">
      {[1, 2, 3].map(i => (
        <Card.Root key={i}>
          <Card.Media>
            <img className="size-full object-cover" src="https://designsystem.digital.gov/img/introducing-uswds-2-0/built-to-grow--alt.jpg" alt="Placeholder" />
          </Card.Media>
          <Card.Header>
            <Card.Title>
              Card title
              {' '}
              {i}
            </Card.Title>
          </Card.Header>
          <Card.Body>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
          </Card.Body>
          <Card.Footer>
            <Button>Visit agency</Button>
          </Card.Footer>
        </Card.Root>
      ))}
    </Card.Group>
  ),
})
