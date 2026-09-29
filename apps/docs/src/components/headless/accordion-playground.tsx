import type { AccordionTheme } from './accordion-styles'
import graphPaper from '#assets/img/graph-paper.svg'
import { ButtonGroup } from '@uswds-tailwind/react/button-group'
import { useId, useState } from 'react'
import { accordionThemes } from './accordion-styles'
import HeadlessAccordion from './headless-accordion'

const startingProps = { multiple: true, defaultValue: ['one'] }

export default function AccordionPlayground() {
  const id = useId()
  const [theme, setTheme] = useState<AccordionTheme>('styleless')
  const [value, setValue] = useState<string[]>(startingProps.defaultValue)

  return (
    <div className="not-docs-prose min-w-0 w-full max-w-6xl mt-6 mb-12">
      <div className="outline-1 outline-gray-cool-20 rounded-t">
        <div className="flex flex-wrap items-center gap-y-3 bg-white px-4 py-3">
          <span id={`${id}-style-label`} className="mr-4 text-sm font-semibold text-black">Visual style</span>
          <div className="max-w-full overflow-x-auto p-2 -m-2">
            <ButtonGroup.Root segmented variant="outline" aria-labelledby={`${id}-style-label`} className="w-max">
              {accordionThemes.map(({ value: visualTheme, label }) => (
                <ButtonGroup.Button
                  key={visualTheme}
                  type="button"
                  variant={theme === visualTheme ? 'blue' : 'outline'}
                  aria-pressed={theme === visualTheme}
                  aria-controls={`${id}-example`}
                  onClick={() => setTheme(visualTheme)}
                  className="shrink-0 px-3 text-sm whitespace-nowrap"
                >
                  {label}
                </ButtonGroup.Button>
              ))}
            </ButtonGroup.Root>
          </div>
        </div>
        <div className="bg-gray-cool-4 min-w-0 outline-1 outline-gray-cool-20" style={{ backgroundImage: `url(${graphPaper.src})` }}>
          <div className="bg-gray-cool-2 shadow-[1px_0px_0px_#dfe1e2] py-4 px-8">
            <section id={`${id}-example`} aria-label="Accordion example">
              <div className="grid min-h-64 place-items-center py-8 sm:px-4">
                <HeadlessAccordion theme={theme} startingProps={startingProps} onValueChange={details => setValue(details.value)} />
              </div>
            </section>
          </div>
        </div>
      </div>
      <section className="outline-1 outline-gray-cool-20 rounded-b" aria-label="Accordion state as JSON">
        <div className="flex min-h-12 items-stretch border-b border-gray-cool-20 bg-white">
          <span className="flex items-center border-r border-gray-cool-20 px-3 text-sm font-semibold text-black">Machine state</span>
        </div>
        <pre className="m-0 max-w-full overflow-x-auto rounded-b bg-gray-cool-2 p-4 text-sm leading-relaxed text-gray-cool-80" tabIndex={0} aria-label="Live accordion state">
          <code className="font-roboto-mono">{JSON.stringify({ props: startingProps, context: { value } }, null, 2)}</code>
        </pre>
      </section>
    </div>
  )
}
