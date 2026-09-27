import { Accordion } from '@uswds-tailwind/react/accordion'

export default function AccordionMultipleDemo() {
  return (
    <Accordion.Root multiple>
      <Accordion.Item value="one">
        <Accordion.ItemTrigger>
          First Amendment
          <Accordion.ItemIndicator />
        </Accordion.ItemTrigger>
        <Accordion.ItemContent>
          <p className="leading-normal max-w-prose">Congress shall make no law respecting an establishment of religion, or prohibiting the free exercise thereof; or abridging the freedom of speech, or of the press; or the right of the people peaceably to assemble, and to petition the Government for a redress of grievances.</p>
        </Accordion.ItemContent>
      </Accordion.Item>
      <Accordion.Item value="two">
        <Accordion.ItemTrigger>
          Second Amendment
          <Accordion.ItemIndicator />
        </Accordion.ItemTrigger>
        <Accordion.ItemContent>
          <p className="leading-normal max-w-prose">A well regulated Militia, being necessary to the security of a free State, the right of the people to keep and bear Arms, shall not be infringed.</p>
        </Accordion.ItemContent>
      </Accordion.Item>
      <Accordion.Item value="third">
        <Accordion.ItemTrigger>
          Third Amendment
          <Accordion.ItemIndicator />
        </Accordion.ItemTrigger>
        <Accordion.ItemContent>
          <p className="leading-normal max-w-prose">No Soldier shall, in time of peace be quartered in any house, without the consent of the Owner, nor in time of war, but in a manner to be prescribed by law.</p>
        </Accordion.ItemContent>
      </Accordion.Item>
    </Accordion.Root>
  )
}
