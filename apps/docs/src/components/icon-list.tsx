import * as React from 'react'
import { icons as materialIcons } from "@iconify-json/material-symbols";
import { actions } from 'astro:actions';
import { experimental_withState as withState } from '@astrojs/react/actions';
import { useDebounce } from '#utils/use-debounce';
import { copyToClipboard } from '#utils/copy-to-clipboard';

export default function IconList({ initialIcons, totalIconCount }: { initialIcons: string[], totalIconCount: number }) {
  const [search, setSearch] = React.useState('')
  const [isTyping, setIsTyping] = React.useState(false)
  const formRef = React.useRef<HTMLFormElement>(null)

  const debouncedSearch = useDebounce(search, 300);

  const [state, action, pending] = React.useActionState(
    withState(actions.getIcons),
    {
      data: {
        filteredIcons: initialIcons,
        totalIconCount
      },
      error: undefined
    }
  );

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (debouncedSearch.trim()) {
      action(new FormData(form))
    } else {
      if (state?.data) state.data.filteredIcons = initialIcons;
    }
  }

  React.useEffect(() => {
    formRef.current?.requestSubmit()
    setIsTyping(false)
  }, [debouncedSearch]);

  return (
    <div className="border border-gray-cool-20">
      <div className="border-b border-gray-cool-20 p-4">
        <div className="mb-2">
          <form onSubmit={handleSubmit} ref={formRef}>
            <label htmlFor="icons" className="block">Search icons</label>
            <div className="mt-2 relative max-w-lg">
              <div className="absolute w-8 left-0 inset-y-0 flex items-center justify-center text-blue-60v pointer-events-none">
                <div className="icon-[material-symbols--search] size-6"></div>
              </div>
              <input
                onChange={(e) => {
                  setSearch(e.target.value)
                  setIsTyping(true)
                }}
                id="icons"
                type="search"
                name="search"
                className="py-2 pl-8 pr-10 w-full h-8 border border-gray-60 focus:outline-offset-0 focus:outline-4 focus:outline-blue-40v data-[invalid]:ring-4 data-[invalid]:ring-red-60v data-[invalid]:border-transparent data-[invalid]:outline-offset-4 [-webkit-search-decoration:appearance-none]"
              />
              {(isTyping || pending)
                ? (
                  <div className="absolute w-10 right-0 inset-y-0 flex items-center justify-center animate-spin text-blue-60v">
                    <div className="icon-[material-symbols--progress-activity] size-6"></div>
                  </div>
                ) : null}
            </div>
          </form>
        </div>
        <p aria-live="polite" className="text-gray-50">
          Showing {state.data?.filteredIcons.length} of {totalIconCount}
        </p>
      </div>
      <div className="bg-gray-cool-2 p-4">
        {
          (state.data && state.data?.filteredIcons.length > 0) ? (
            <ul className="grid grid-cols-2 tablet:grid-cols-3 gap-3">
              {state.data?.filteredIcons.map((iconName) => (
                <li key={iconName}>
                  <IconButton iconName={iconName} />
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center w-full py-4">
              <span className="text-gray-cool-70">No icons matched your search</span>
            </div>
          )
        }
      </div>
    </div>
  )
}

const IconButton = ({ iconName }: { iconName: string }) => {
  const [isCopied, setIsCopied] = React.useState(false)
  const [copyMessage, setCopyMessage] = React.useState<string | null>(null)

  const handleCopyToClipboard = () => {
    copyToClipboard('icon-[material-symbols--' + iconName + ']')
    setIsCopied(true)
    setCopyMessage(`material symbols ${iconName} copied to clipboard`)

    setTimeout(() => setIsCopied(false), 1000)
  }

  return (
    <>
      <button
        className="text-gray-cool-80 gap-1 border h-32 border-gray-cool-10 bg-white rounded flex flex-col items-center justify-center p-4 shadow hover:bg-gray-cool-2 focus:outline-4 focus:outline-blue-40v w-full relative overflow-hidden"
        onClick={() => handleCopyToClipboard()}
      >
        <div className="size-8">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            viewBox="0 0 24 24"
            dangerouslySetInnerHTML={{
              __html: materialIcons.icons[iconName].body
            }}
          />
        </div>
        <div className="truncate text-ellipsis w-full">
          <span className="text-xs" aria-hidden="true">{'.icon-[material-symbols--' + iconName + ']'}</span>
          <span className="sr-only">Copy {iconName} icon to clipboard</span>
        </div>
        {isCopied
          ? (
            <div className="absolute inset-x-0 bottom-0 pb-1">
              <span aria-hidden="true" className="text-xs font-medium text-green">Copied to clipboard!</span>
            </div>
          )
          : null}
      </button>
      <span aria-live="polite" className="sr-only">{copyMessage}</span>
    </>
  )
}
