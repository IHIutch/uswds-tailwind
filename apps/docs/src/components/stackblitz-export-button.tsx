import { useState } from 'react'

export default function StackBlitzExportButton({ componentName, library, onOpen }: {
  componentName: string
  library: 'vanilla' | 'react'
  onOpen: () => void
}) {
  const [error, setError] = useState('')

  const handleClick = () => {
    try {
      setError('')
      onOpen()
    }
    catch (cause) {
      console.error('Failed to open StackBlitz:', cause)
      setError('Could not open StackBlitz. Please try again.')
      return
    }

    try {
      const event = library === 'react'
        ? `Stackblitz: ${componentName} - React`
        : `Stackblitz: ${componentName}`
      // @ts-expect-error Fathom is loaded globally
      window.fathom?.trackEvent?.(event)
    }
    catch {
      // Analytics is optional.
    }
  }

  return (
    <div className="flex items-center gap-2">
      {error && <span role="alert" className="text-red-60v text-sm">{error}</span>}
      <button
        type="button"
        onClick={handleClick}
        className="flex rounded-sm items-center justify-center h-8 bg-[#1574ef] hover:bg-[#135fcc] px-3 gap-1 text-sm text-white focus:outline-4 focus:outline-offset-2 cursor-pointer focus:outline-blue-40v transition-colors"
      >
        <svg stroke="currentColor" fill="currentColor" strokeWidth="0" role="img" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M10.797 14.182H3.635L16.728 0l-3.525 9.818h7.162L7.272 24l3.524-9.818Z"></path></svg>
        StackBlitz
      </button>
    </div>
  )
}
