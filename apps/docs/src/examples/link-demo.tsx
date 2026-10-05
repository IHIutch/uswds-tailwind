import { Link } from '@uswds-tailwind/react'

export default function LinkDemo() {
  return (
    <div className="space-y-12">
      <div className="space-y-4">
        <p>
          This is
          {' '}
          <Link href="/docs/react/getting-started">a text link</Link>
          {' '}
          on a light background.
        </p>
        <p>
          This is
          {' '}
          <Link href="https://designsystem.digital.gov/" isExternal>
            a link to an external website
            <span className="sr-only">External</span>
          </Link>
          .
        </p>
        <p>
          This is
          {' '}
          <Link href="https://designsystem.digital.gov/" isExternal target="_blank" rel="noopener noreferrer">
            a link that opens in a new tab
            <span className="sr-only">External, opens in a new tab</span>
          </Link>
          .
        </p>
      </div>

      <div className="space-y-4 bg-gray-90 p-4 text-white">
        <p>
          This is
          {' '}
          <Link href="/docs/react/getting-started" variant="light">a text link</Link>
          {' '}
          on a dark background.
        </p>
        <p>
          This is
          {' '}
          <Link href="https://designsystem.digital.gov/" variant="light" isExternal target="_blank" rel="noopener noreferrer">
            an external text link
            <span className="sr-only">External, opens in a new tab</span>
          </Link>
          {' '}
          on a dark background.
        </p>
      </div>
    </div>
  )
}
