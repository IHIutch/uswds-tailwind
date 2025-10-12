import * as React from 'react'
import { useDebounce } from "#utils/use-debounce";
import { copyToClipboard } from '#utils/copy-to-clipboard';
import { actions } from 'astro:actions';

type IconData = {
  name: string;
  svg: string;
}

export default function IconList() {
  const [search, setSearch] = React.useState('')
  const [filteredIcons, setFilteredIcons] = React.useState<IconData[]>([])

  const debouncedSearch = useDebounce(search, 300);

  React.useEffect(() => {
    async function handleSubmit(search: string) {
      const { data } = await actions.searchIcons({ query: search })
      setFilteredIcons(data || [])
    }

    handleSubmit(debouncedSearch)
  }, [debouncedSearch]);

  return (
    <div className="border border-gray-cool-20">
      <div className="border-b border-gray-cool-20 p-4">
        <div className="mb-2">
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
        </div>
        <p aria-live="polite" className="text-gray-50">Click an icon to copy its class name.</p>
      </div>
      <div className="bg-gray-cool-2 p-4">
        {
          filteredIcons.length > 0 ? (
            <ul className="grid grid-cols-3 gap-3">
              {filteredIcons.map((icon) => (
                <li key={icon.name}>
                  <button
                    className="text-gray-cool-80 gap-2 border border-gray-cool-10 bg-white rounded flex flex-col items-center justify-center p-4 shadow hover:bg-gray-cool-2 focus:outline focus:outline-4 focus:outline-blue-40v w-full"
                    onClick={() => copyToClipboard('icon-[material-symbols--' + icon.name + ']')}
                    title={'.icon-[material-symbols--' + icon.name + ']'}
                  >
                    <div className="size-8" dangerouslySetInnerHTML={{ __html: icon.svg }} />
                    <div className="truncate text-ellipsis w-full">
                      <span aria-hidden className="text-xs">{'.icon-[material-symbols--' + icon.name + ']'}</span>
                      <span className="sr-only">{icon.name.replaceAll('-', ' ')}</span>
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
