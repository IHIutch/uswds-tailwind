import * as React from 'react'
import { icons as materialIcons } from "@iconify-json/material-symbols";
import Fuse from "fuse.js";
import { getIcons } from '@iconify/utils';
import { useDebounce } from "@uidotdev/usehooks";

const SEARCH_LIMIT = 250
const iconList = Object.keys(materialIcons.icons)
const fuse = new Fuse(iconList, {
  // isCaseSensitive: false,
  // includeScore: true,
  // shouldSort: true,
  // includeMatches: false,
  // findAllMatches: false,
  // minMatchCharLength: 1,
  // location: 0,
  threshold: 0.25,
  distance: 10,
  // useExtendedSearch: false,
  ignoreLocation: true,
  // ignoreFieldNorm: false,
  // fieldNormWeight: 1,
  // keys: [
  //   "title",
  //   "author.firstName"
  // ]
});

export default function IconList() {
  const [search, setSearch] = React.useState('')
  const [filteredIcons, setFilteredIcons] = React.useState<string[]>([])
  const debouncedSearch = useDebounce(search, 300);

  const copyTextToClipboard = async (text: string) => {
    if ('clipboard' in navigator) {
      return await navigator.clipboard.writeText(text);
    } else {
      return document.execCommand('copy', true, text);
    }
  }

  React.useEffect(() => {
    const handleSearch = async () => {
      // setIsSearching(true);

      const searchResults = fuse.search(debouncedSearch, {
        limit: SEARCH_LIMIT
      })

      const filteredIconsJson = getIcons(materialIcons, debouncedSearch
        ? searchResults.map(i => i.item)
        : iconList.slice(0, SEARCH_LIMIT)
      );

      const filteredIconsList = Object.keys(filteredIconsJson?.icons || {})
      if (!debouncedSearch) {
        filteredIconsList.sort()
      }
      // setIsSearching(false);
      setFilteredIcons(filteredIconsList);
    };
    handleSearch()
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
              className="p-2 w-full max-w-lg h-8 border border-gray-60 focus:outline focus:outline-offset-0 focus:outline-4 focus:outline-blue-40v data-[invalid]:ring-4 data-[invalid]:ring-red-60v data-[invalid]:border-transparent data-[invalid]:outline-offset-4"
            />
          </div>
        </div>
        <p aria-live="polite" className="text-gray-50">{filteredIcons.length} of {iconList.length} icons. Click an icon to copy its class name.</p>
      </div>
      <div className="bg-gray-cool-2 p-4">
        {
          filteredIcons.length > 0 ? (
            <div className="grid grid-cols-3 gap-3">
              {filteredIcons.map((mi) => (
                <button
                  key={mi}
                  className="text-gray-cool-80 gap-2 border border-gray-cool-10 bg-white rounded flex flex-col items-center justify-center p-4 shadow hover:bg-gray-cool-2 focus:outline focus:outline-4 focus:outline-blue-40v"
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

              ))}
            </div>
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
