import { Alert } from '@uswds-tailwind/react/alert'
import { Link } from '@uswds-tailwind/react/link'

export default function AlertSlimDemo() {
  return (
    <div className="space-y-4">
      <Alert.Root variant="info" slim role="status">
        <Alert.Content>
          <Alert.Indicator />
          <Alert.Description>
            Lorem ipsum dolor sit amet,
            {' '}
            <Link href="#">consectetur adipiscing</Link>
            {' '}
            elit, sed do eiusmod.
          </Alert.Description>
        </Alert.Content>
      </Alert.Root>
      <Alert.Root variant="warning" slim role="status">
        <Alert.Content>
          <Alert.Indicator />
          <Alert.Description>
            Lorem ipsum dolor sit amet,
            {' '}
            <Link href="#">consectetur adipiscing</Link>
            {' '}
            elit, sed do eiusmod.
          </Alert.Description>
        </Alert.Content>
      </Alert.Root>
      <Alert.Root variant="success" slim role="status">
        <Alert.Content>
          <Alert.Indicator />
          <Alert.Description>
            Lorem ipsum dolor sit amet,
            {' '}
            <Link href="#">consectetur adipiscing</Link>
            {' '}
            elit, sed do eiusmod.
          </Alert.Description>
        </Alert.Content>
      </Alert.Root>
      <Alert.Root variant="error" slim role="alert">
        <Alert.Content>
          <Alert.Indicator />
          <Alert.Description>
            Lorem ipsum dolor sit amet,
            {' '}
            <Link href="#">consectetur adipiscing</Link>
            {' '}
            elit, sed do eiusmod.
          </Alert.Description>
        </Alert.Content>
      </Alert.Root>
      <Alert.Root variant="emergency" slim role="alert">
        <Alert.Content>
          <Alert.Indicator />
          <Alert.Description>
            Lorem ipsum dolor sit amet,
            {' '}
            <Link href="#" variant="light">consectetur adipiscing</Link>
            {' '}
            elit, sed do eiusmod.
          </Alert.Description>
        </Alert.Content>
      </Alert.Root>
    </div>
  )
}
