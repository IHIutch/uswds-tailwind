import { Accordion, SimpleAccordion } from '@uswds-tailwind/react'

const data = [
  { title: 'Watercraft', content: 'Sample accordion content' },
  { title: 'Automobiles', content: 'Sample accordion content' },
  { title: 'Aircraft', content: 'Sample accordion content' },
]

export default function App() {
  return (
    <div className="min-h-screen bg-white">
      <header className="bg-blue-60v text-white py-8">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold">USWDS Tailwind React Components</h1>
          <p className="text-blue-10 mt-2">
            Interactive examples of React components built with USWDS design system and Tailwind CSS
          </p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">

        <div className="space-y-12">

          <section id="simple-accordion">
            <h2 className="text-2xl font-bold text-gray-90 mb-4">Basic Accordion</h2>
            <SimpleAccordion />
          </section>

          <section id="simple-accordion">
            <h2 className="text-2xl font-bold text-gray-90 mb-4">Accordion Multiple</h2>
            <SimpleAccordion multiple />
          </section>

          <section id="simple-accordion">
            <h2 className="text-2xl font-bold text-gray-90 mb-4">Accordion with Default Value</h2>
            <Accordion.Root>
              {data.map(item => (
                <Accordion.Item key={item.title} value={item.title}>
                  <h3 className="relative">
                    <Accordion.Trigger value={item.title} className="group flex items-center w-full py-4 px-5 bg-gray-5 hover:bg-gray-10 font-bold focus:outline-4 focus:outline-blue-40v cursor-pointer text-left gap-3">
                      {item.title}

                      <div className="h-full flex items-center ml-auto shrink-0">
                        <div className="size-6 icon-[material-symbols--add] group-aria-expanded:icon-[material-symbols--remove]"></div>
                      </div>
                    </Accordion.Trigger>
                  </h3>
                  <Accordion.Content value={item.title} className="py-6 px-4 not-data-[state=open]:hidden">
                    <div className="leading-normal max-w-prose">{item.content}</div>
                  </Accordion.Content>
                </Accordion.Item>
              ))}
            </Accordion.Root>
          </section>

        </div>
      </main>

    </div>
  )
}
