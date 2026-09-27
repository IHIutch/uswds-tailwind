import { Alert } from '@uswds-tailwind/react/alert'
import { Link } from '@uswds-tailwind/react/link'

export default function AlertSlimNoIconDemo() {
  return (
    <div className="space-y-4">
      <Alert.Root variant="info" slim noIcon role="status">
        <Alert.Content>
          <Alert.Description>
            Lorem ipsum dolor sit amet,
            {' '}
            <Link href="#">consectetur adipiscing</Link>
            {' '}
            elit, sed do eiusmod.
          </Alert.Description>
        </Alert.Content>
      </Alert.Root>
      <Alert.Root variant="warning" slim noIcon role="status">
        <Alert.Content>
          <Alert.Description>
            Lorem ipsum dolor sit amet,
            {' '}
            <Link href="#">consectetur adipiscing</Link>
            {' '}
            elit, sed do eiusmod.
          </Alert.Description>
        </Alert.Content>
      </Alert.Root>
      <Alert.Root variant="success" slim noIcon role="status">
        <Alert.Content>
          <Alert.Description>
            Lorem ipsum dolor sit amet,
            {' '}
            <Link href="#">consectetur adipiscing</Link>
            {' '}
            elit, sed do eiusmod.
          </Alert.Description>
        </Alert.Content>
      </Alert.Root>
      <Alert.Root variant="error" slim noIcon role="alert">
        <Alert.Content>
          <Alert.Description>
            Lorem ipsum dolor sit amet,
            {' '}
            <Link href="#">consectetur adipiscing</Link>
            {' '}
            elit, sed do eiusmod.
          </Alert.Description>
        </Alert.Content>
      </Alert.Root>
      <Alert.Root variant="emergency" slim noIcon role="alert">
        <Alert.Content>
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
