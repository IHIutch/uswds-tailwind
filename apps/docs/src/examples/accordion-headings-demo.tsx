import { Accordion } from '@uswds-tailwind/react/accordion'

export default function AccordionHeadingsDemo() {
  return (
    <Accordion.Root>
      <Accordion.Item value="one">
        <h4>
          <Accordion.ItemTrigger>
            First Amendment
            <Accordion.ItemIndicator />
          </Accordion.ItemTrigger>
        </h4>
        <Accordion.ItemContent>
          <p className="leading-normal max-w-prose">Congress shall make no law respecting an establishment of religion, or prohibiting the free exercise thereof; or abridging the freedom of speech, or of the press; or the right of the people peaceably to assemble, and to petition the Government for a redress of grievances.</p>
        </Accordion.ItemContent>
      </Accordion.Item>
    </Accordion.Root>
  )
}
