import { Accordion } from '@uswds-tailwind/react/accordion'

export default function App() {
  return (
    <main className="mx-auto max-w-prose p-6 font-source-sans">
      <h1 className="mb-4 text-3xl font-bold">Hello, USWDS + Tailwind!</h1>
      <p className="mb-6">Edit src/App.tsx to start building your site.</p>
      <Accordion.Root>
        <Accordion.Item value="getting-started">
          <h2>
            <Accordion.ItemTrigger>What's included?</Accordion.ItemTrigger>
          </h2>
          <Accordion.ItemContent>
            <p>Vite, React, TypeScript, Tailwind CSS, and USWDS + Tailwind are ready to use.</p>
            <a className="text-blue-60v underline" href="https://uswds-tailwind.com/docs/react/getting-started">Read the documentation</a>
          </Accordion.ItemContent>
        </Accordion.Item>
      </Accordion.Root>
    </main>
  )
}
