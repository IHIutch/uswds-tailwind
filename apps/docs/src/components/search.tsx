import * as DocSearch from '@docsearch/react' // https://github.com/algolia/docsearch/pull/2117#issuecomment-1793855627

import * as React from 'react'
import { createPortal } from 'react-dom'

const Hit: DocSearch.DocSearchProps['hitComponent'] = ({ hit, children }) => {
  return (
    <a
      href={hit.url}
    >
      {children}
    </a>
  )
}

export default function Search({ isMobile = false }: { isMobile?: boolean }) {
  const [isOpen, setIsOpen] = React.useState(false)

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (isMobile) {
      event.currentTarget.closest('[data-scope="modal"][data-part="content"]')
        ?.querySelector<HTMLButtonElement>('[data-scope="modal"][data-part="close-trigger"]')
        ?.click()
      setTimeout(() => setIsOpen(true), 100)
    }
    else {
      setIsOpen(true)
    }
  }

  return (
    <>
      <button onClick={handleOpen} aria-label="Search" type="button" className="group w-full desktop:w-64 max-w-64 outline-hidden">
        <div className="relative flex items-center">
          <div
            className="p-2 bg-transparent w-full max-w-lg h-8 border border-r-0 border-gray-60 focus:outline-4 focus:outline-blue-40v data-[invalid]:ring-4 data-[invalid]:ring-red-60v data-[invalid]:border-transparent data-[invalid]:outline-offset-4"
          >
          </div>
          <div
            className="flex items-center rounded-r font-bold leading-none text-white px-3 h-8 bg-blue-60v group-hover:bg-blue-warm-70v group-active:bg-blue-warm-80v group-group-focus:outline-4 group-focus:outline-offset-4 group-focus:outline-blue-40v"
          >
            <div className="icon-[material-symbols--search] size-6"></div>
          </div>
        </div>
      </button>
      {isOpen
        ? (createPortal(
            <DocSearch.DocSearchModal
              initialScrollY={window.scrollY}
              appId="C7D4AGKF3W"
              indices={['uswds-tailwind-vercel']}
              apiKey="28412ab462fa29c28f804fa3577d6b13"
              onClose={() => setIsOpen(false)}
              onAskAiToggle={() => {}}
              placeholder="Search the docs..."
              hitComponent={Hit}
              transformItems={(items) => {
                return items.map((item, index) => {
                  const a = document.createElement('a')
                  a.href = item.url

                  if (item.hierarchy?.lvl0) {
                    item.hierarchy.lvl0 = item.hierarchy.lvl0.replace(/&amp;/g, '&')
                  }

                  if (item._highlightResult?.hierarchy?.lvl0?.value) {
                    item._highlightResult.hierarchy.lvl0.value
                      = item._highlightResult.hierarchy.lvl0.value.replace(
                        /&amp;/g,
                        '&',
                      )
                  }

                  return {
                    ...item,
                    url: `${a.pathname}${a.hash}`,
                    __is_result: () => true,
                    // __is_parent: () =>
                    //   item.type === 'lvl1' && items.length > 1 && index === 0,
                    // __is_child: () =>
                    //   item.type !== 'lvl1' &&
                    //   items.length > 1 &&
                    //   items[0].type === 'lvl1' &&
                    //   index !== 0,
                    __is_first: () => index === 1,
                    __is_last: () => index === items.length - 1 && index !== 0,
                  }
                })
              }}
            />,
            document.body,
          ))
        : null}
    </>
  )
}
