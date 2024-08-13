import * as React from 'react'
import { icons as materialIcons } from "@iconify-json/material-symbols";
import Fuse from "fuse.js";
import { getIcons } from '@iconify/utils';

const icons = Object.keys(materialIcons.icons);
const fuse = new Fuse(icons, {
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

const SEARCH_LIMIT = 250

export default function IconList() {
  const [search, setSearch] = React.useState('')
  const searchResults = fuse.search(search, {
    limit: SEARCH_LIMIT
  })
  // const searchResults = icons.filter(i => i.startsWith(search))
  const filteredIconsJson = getIcons(materialIcons, search
    ? searchResults.map(i => i.item)
    : icons.slice(0, SEARCH_LIMIT)
  );
  let filteredIconsList = Object.keys(filteredIconsJson?.icons || {})
  if (!search) {
    filteredIconsList.sort()
  }

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
        <p aria-live="polite" className="text-gray-50">{filteredIconsList.length} of {icons.length} icons. Click an icon to copy its codesnippet.</p>
      </div>
      <div className="grid grid-cols-5 gap-3 bg-gray-cool-2 p-4">
        {
          filteredIconsList.map((mi) => (
            <button key={mi} className="text-gray-cool-80 gap-1 aspect-square border border-gray-cool-10 bg-white rounded flex flex-col items-center justify-center p-2 shadow hover:bg-gray-cool-2 focus:outline focus:outline-4 focus:outline-blue-40v">
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
              <div className="text-ellipsis whitespace-nowrap overflow-hidden w-full">
                <span className="text-xs">{mi}</span>
              </div>
            </button>
          ))
        }
      </div>
    </div>
  )
}
