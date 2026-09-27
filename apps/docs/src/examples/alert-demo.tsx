import { Alert } from '@uswds-tailwind/react/alert'
import { Link } from '@uswds-tailwind/react/link'

export default function AlertDemo() {
  return (
    <div className="space-y-4">
      <Alert.Root variant="info" role="status">
        <Alert.Content>
          <Alert.Indicator />
          <Alert.Title>Info status</Alert.Title>
          <Alert.Description>
            Lorem ipsum dolor sit amet,
            {' '}
            <Link href="#">consectetur adipiscing</Link>
            {' '}
            elit, sed do eiusmod.
          </Alert.Description>
        </Alert.Content>
      </Alert.Root>
      <Alert.Root variant="warning" role="status">
        <Alert.Content>
          <Alert.Indicator />
          <Alert.Title>Warning status</Alert.Title>
          <Alert.Description>
            Lorem ipsum dolor sit amet,
            {' '}
            <Link href="#">consectetur adipiscing</Link>
            {' '}
            elit, sed do eiusmod.
          </Alert.Description>
        </Alert.Content>
      </Alert.Root>
      <Alert.Root variant="success" role="status">
        <Alert.Content>
          <Alert.Indicator />
          <Alert.Title>Success status</Alert.Title>
          <Alert.Description>
            Lorem ipsum dolor sit amet,
            {' '}
            <Link href="#">consectetur adipiscing</Link>
            {' '}
            elit, sed do eiusmod.
          </Alert.Description>
        </Alert.Content>
      </Alert.Root>
      <Alert.Root variant="error" role="alert">
        <Alert.Content>
          <Alert.Indicator />
          <Alert.Title>Error status</Alert.Title>
          <Alert.Description>
            Lorem ipsum dolor sit amet,
            {' '}
            <Link href="#">consectetur adipiscing</Link>
            {' '}
            elit, sed do eiusmod.
          </Alert.Description>
        </Alert.Content>
      </Alert.Root>
      <Alert.Root variant="emergency" role="alert">
        <Alert.Content>
          <Alert.Indicator />
          <Alert.Title>Emergency alert message</Alert.Title>
          <Alert.Description>
            Additional context and followup information including
            {' '}
            <Link href="#" variant="light">a link</Link>
            .
          </Alert.Description>
        </Alert.Content>
      </Alert.Root>
    </div>
  )
}
