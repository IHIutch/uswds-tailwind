import { Accordion } from '@uswds-tailwind/react'

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
            <h2 className="text-2xl font-bold text-gray-90 mb-4">Accordion with Default Value</h2>
            <Accordion.Root>
              {data.map(item => (
                <Accordion.Item key={item.title} value={item.title}>
                  <h3>
                    <Accordion.Trigger>
                      {item.title}

                      <Accordion.ItemIndicator>
                        {({ isOpen }) => (<div>{ isOpen ? '-' : '+' }</div>)}
                      </Accordion.ItemIndicator>
                    </Accordion.Trigger>
                  </h3>
                  <Accordion.Content>
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
