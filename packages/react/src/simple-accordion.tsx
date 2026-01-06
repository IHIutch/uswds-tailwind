import * as accordion from '@uswds-tailwind/accordion-compat'
import { normalizeProps, useMachine } from '@zag-js/react'
import { useId } from 'react'

const data = [
  { title: 'Watercraft', content: 'Sample accordion content' },
  { title: 'Automobiles', content: 'Sample accordion content' },
  { title: 'Aircraft', content: 'Sample accordion content' },
]

export function SimpleAccordion(props: Omit<accordion.Props, 'id'>) {
  const service = useMachine(accordion.machine, {
    id: useId(),
    ...props,
  })

  const api = accordion.connect(service, normalizeProps)

  return (
    <div {...api.getRootProps()}>
      {data.map(item => (
        <div key={item.title} {...api.getItemProps({ value: item.title })}>
          <h3 className="relative">
            <button
              {...api.getTriggerProps({ value: item.title })}
              className="group flex items-center w-full py-4 px-5 bg-gray-5 hover:bg-gray-10 font-bold focus:outline-4 focus:outline-blue-40v cursor-pointer text-left gap-3"
            >
              {item.title}
              <div className="h-full flex items-center ml-auto shrink-0">
                <div className="size-6 icon-[material-symbols--add] group-aria-expanded:icon-[material-symbols--remove]"></div>
              </div>
            </button>
          </h3>
          <div {...api.getContentProps({ value: item.title })} className="py-6 px-4 not-data-[state=open]:hidden">
            <div className="leading-normal max-w-prose">{item.content}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
