import preview from '../../.storybook/preview'
import { cx } from '../cva.config'
import { Alert } from './alert'

const meta = preview.meta({
  title: 'Components/Alert',
  component: Alert.Root,
  argTypes: {
    variant: {
      control: 'select',
      options: ['info', 'warning', 'success', 'error', 'emergency'],
      table: {
        defaultValue: {
          summary: 'info',
        },
      },
    },
    slim: {
      control: 'boolean',
      table: {
        defaultValue: {
          summary: 'false',
        },
      },
    },
    noIcon: {
      control: 'boolean',
      table: {
        defaultValue: {
          summary: 'false',
        },
      },
    },
  },
})

export const Basic = meta.story({
  args: {
    variant: 'info',
    slim: false,
    noIcon: false,
  },
  render: ({ variant, slim, noIcon }) => (
    <Alert.Root variant={variant} slim={slim} noIcon={noIcon}>
      <Alert.Content>
        {noIcon ? null : <Alert.Indicator />}
        {slim ? null : <Alert.Title>Info status</Alert.Title>}
        <Alert.Description>
          Lorem ipsum dolor sit amet,
          {' '}
          <a href="#" className="text-blue-60v underline">consectetur adipiscing</a>
          {' '}
          elit, sed do eiusmod.
        </Alert.Description>
      </Alert.Content>
    </Alert.Root>
  ),
})

export const Warning = meta.story({
  render: () => (
    <Alert.Root variant="warning">
      <Alert.Content>
        <Alert.Indicator />
        <Alert.Title>Warning status</Alert.Title>
        <Alert.Description>
          Lorem ipsum dolor sit amet,
          {' '}
          <a href="#" className="text-blue-60v underline">consectetur adipiscing</a>
          {' '}
          elit, sed do eiusmod.
        </Alert.Description>
      </Alert.Content>
    </Alert.Root>
  ),
})

export const Success = meta.story({
  render: () => (
    <Alert.Root variant="success">
      <Alert.Content>
        <Alert.Indicator />
        <Alert.Title>Success status</Alert.Title>
        <Alert.Description>
          Lorem ipsum dolor sit amet,
          {' '}
          <a href="#" className="text-blue-60v underline">consectetur adipiscing</a>
          {' '}
          elit, sed do eiusmod.
        </Alert.Description>
      </Alert.Content>
    </Alert.Root>
  ),
})

export const Error = meta.story({
  render: () => (
    <Alert.Root variant="error">
      <Alert.Content>
        <Alert.Indicator />
        <Alert.Title>Error status</Alert.Title>
        <Alert.Description>
          Lorem ipsum dolor sit amet,
          {' '}
          <a href="#" className="text-blue-60v underline">consectetur adipiscing</a>
          {' '}
          elit, sed do eiusmod.
        </Alert.Description>
      </Alert.Content>
    </Alert.Root>
  ),
})

export const Emergency = meta.story({
  render: () => (
    <Alert.Root variant="emergency">
      <Alert.Content>
        <Alert.Indicator />
        <Alert.Title>Emergency alert message</Alert.Title>
        <Alert.Description>
          Additional context and followup information including
          {' '}
          <a href="#" className="text-gray-10 underline">a link</a>
          .
        </Alert.Description>
      </Alert.Content>
    </Alert.Root>
  ),
})

const variants = ['info', 'warning', 'success', 'error', 'emergency'] as const

export const Slim = meta.story({
  render: () => (
    <div className="space-y-4">
      {variants.map(variant => (
        <Alert.Root key={variant} variant={variant} slim>
          <Alert.Content>
            <Alert.Indicator />
            <Alert.Description>
              Lorem ipsum dolor sit amet,
              {' '}
              <a
                href="#"
                className={cx('underline', variant === 'emergency'
                  ? 'text-gray-10'
                  : 'text-blue-60v')}
              >
                consectetur adipiscing
              </a>
              {' '}
              elit, sed do eiusmod.
            </Alert.Description>
          </Alert.Content>
        </Alert.Root>
      ))}
    </div>
  ),
})

export const NoIcon = meta.story({
  render: () => (
    <div className="space-y-4">
      {variants.map(variant => (
        <Alert.Root key={variant} variant={variant} noIcon>
          <Alert.Content>
            <Alert.Description>
              Lorem ipsum dolor sit amet,
              {' '}
              <a
                href="#"
                className={cx('underline', variant === 'emergency'
                  ? 'text-gray-10'
                  : 'text-blue-60v')}
              >
                consectetur adipiscing
              </a>
              {' '}
              elit, sed do eiusmod.
            </Alert.Description>
          </Alert.Content>
        </Alert.Root>
      ))}
    </div>
  ),
})

export const SlimNoIcon = meta.story({
  render: () => (
    <div className="space-y-4">
      {variants.map(variant => (
        <Alert.Root key={variant} variant={variant} slim noIcon>
          <Alert.Content>
            <Alert.Description>
              Lorem ipsum dolor sit amet,
              {' '}
              <a
                href="#"
                className={cx('underline', variant === 'emergency'
                  ? 'text-gray-10'
                  : 'text-blue-60v')}
              >
                consectetur adipiscing
              </a>
              {' '}
              elit, sed do eiusmod.
            </Alert.Description>
          </Alert.Content>
        </Alert.Root>
      ))}
    </div>
  ),
})
