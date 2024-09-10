import * as React from 'react'
import { icons as materialIcons } from "@iconify-json/material-symbols";
import { actions } from 'astro:actions';
import { experimental_withState as withState } from '@astrojs/react/actions';
import { useDebounce } from '#utils/use-debounce';

export default function IconList() {
  const [search, setSearch] = React.useState('')
  // const [filteredIcons, setFilteredIcons] = React.useState<string[]>([])
  const debouncedSearch = useDebounce(search, 300);

  const [state, action, pending] = React.useActionState(
    withState(actions.getIcons),
    { data: { icons: [] }, error: undefined }
  );

  const copyTextToClipboard = async (text: string) => {
    if ('clipboard' in navigator) {
      return await navigator.clipboard.writeText(text);
    } else {
      return document.execCommand('copy', true, text);
    }
  }

  React.useEffect(() => {
    let formData = new FormData();    //formdata object
    formData.append('search', debouncedSearch);
    action(formData)
  }, [debouncedSearch]);


  return (
    <div className="border border-gray-cool-20">
      <div className="border-b border-gray-cool-20 p-4">
        <div className="mb-2">
          {/* <form action={action}> */}
          <label htmlFor="icons" className="block">Type to filter icons</label>
          <div className="mt-2 relative">
            <input
              onChange={(e) => setSearch(e.target.value)}
              id="icons"
              type="search"
              name="search"
              className="p-2 w-full max-w-lg h-8 border border-gray-60 focus:outline focus:outline-offset-0 focus:outline-4 focus:outline-blue-40v data-[invalid]:ring-4 data-[invalid]:ring-red-60v data-[invalid]:border-transparent data-[invalid]:outline-offset-4"
            />
          </div>
          {/* <button>search</button> */}
          {/* </form> */}
        </div>
        <p aria-live="polite" className="text-gray-50">Click an icon to copy its class name.</p>
      </div>
      <div className="bg-gray-cool-2 p-4">
        {
          (state.data && state.data.icons.length > 0) ? (
            <ul className="grid grid-cols-3 gap-3">
              {state.data.icons.map((mi) => (
                <li key={mi}>
                  <button
                    className="text-gray-cool-80 gap-2 border border-gray-cool-10 bg-white rounded flex flex-col items-center justify-center p-4 shadow hover:bg-gray-cool-2 focus:outline focus:outline-4 focus:outline-blue-40v w-full"
                    onClick={() => copyTextToClipboard('icon-[material-symbols--' + mi + ']')}
                    title={'.icon-[material-symbols--' + mi + ']'}
                  >
                    <div className="size-8">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="100%"
                        height="100%"
                        viewBox="0 0 24 24"
                        dangerouslySetInnerHTML={{
                          __html: materialIcons.icons[mi].body
                        }}
                      />
                    </div>
                    <div className="truncate text-ellipsis w-full">
                      <span aria-hidden className="text-xs">{'.icon-[material-symbols--' + mi + ']'}</span>
                      <span className="sr-only">{mi.replaceAll('-', ' ')}</span>
                      {/* <span aria-live="assertive">Copied to clipboard!</span> */}
                    </div>
                  </button>
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
