// <!-- ---
// type Props = {
//   hex: string;
//   level: string;
//   name: string;
// };

// const { hex, level, name } = Astro.props;

// console.log({ name });
// --- -->

import { copyToClipboard } from '#utils/copy-to-clipboard'
import * as React from 'react'

export default function ColorSwatch({ hex, level, name }: {
  hex: string
  level: string
  name: string
}) {
  const [isCopied, setIsCopied] = React.useState(false)
  const [copyMessage, setCopyMessage] = React.useState<string | null>(null)


  const handleCopyToClipboard = () => {
    copyToClipboard(hex)
    setIsCopied(true)
    setCopyMessage(`${readableName} copied to clipboard`)

    setTimeout(() => setIsCopied(false), 1000)
  }

  const readableName = name.replaceAll("-", " ").replace("v", " vivid")

  return (
    <>
      <button
        className="flex w-full text-left max-desktop:items-center flex-col tablet:flex-row desktop:flex-col rounded border border-gray-cool-10 overflow-hidden shadow focus:outline focus:outline-4 focus:outline-blue-40v"
        type="button"
        onClick={handleCopyToClipboard}
      >
        <div
          className="h-12 tablet:h-16 desktop:h-12 w-full tablet:max-w-24"
          style={{ backgroundColor: hex }}
        >
        </div>
        <div className="py-1 px-2 tablet:py-0 desktop:p-1 w-full">
          <p className="sr-only">
            Copy {readableName} to clipboard
          </p>
          <p aria-hidden="true" className="text-sm font-medium leading-tight">
            {level}
          </p>
          <p
            aria-hidden="true"
            className="text-xs font-roboto-mono text-gray-cool-60 leading-tight"
          >
            {hex}
          </p>
        </div>
      </button>
      <span aria-live='polite' className='sr-only'>{copyMessage}</span>
    </>
  )
}


