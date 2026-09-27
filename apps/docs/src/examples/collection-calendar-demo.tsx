import { Collection } from '@uswds-tailwind/react/collection'
import { Link } from '@uswds-tailwind/react/link'

export default function CollectionCalendarDemo() {
  return (
    <Collection.Root>
      <Collection.List>
        <Collection.Item startElement={(
          <Collection.Calendar dateTime={new Date(2020, 8, 30)}>
            <Collection.CalendarMonth />
            <Collection.CalendarDate />
          </Collection.Calendar>
        )}
        >
          <Collection.Heading>
            <h4><Link href="#" isExternal>Gears of Government President's Award winners</Link></h4>
          </Collection.Heading>
          <Collection.Description>
            Today, the Administration announces the winners of the Gears of Government President's Award. This program recognizes contributions across the federal workforce.
          </Collection.Description>
        </Collection.Item>
        <Collection.Item startElement={(
          <Collection.Calendar dateTime={new Date(2020, 8, 30)}>
            <Collection.CalendarMonth />
            <Collection.CalendarDate />
          </Collection.Calendar>
        )}
        >
          <Collection.Heading>
            <h4><Link href="#" isExternal>Women-owned small business dashboard</Link></h4>
          </Collection.Heading>
          <Collection.Description>
            In honor of National Women's Small Business Month, this dashboard highlights data about women-owned small businesses.
          </Collection.Description>
        </Collection.Item>
        <Collection.Item startElement={(
          <Collection.Calendar dateTime={new Date(2020, 8, 17)}>
            <Collection.CalendarMonth />
            <Collection.CalendarDate />
          </Collection.Calendar>
        )}
        >
          <Collection.Heading>
            <h4><Link href="#" isExternal>September 2020 updates show progress on cross-agency and agency priority goals</Link></h4>
          </Collection.Heading>
          <Collection.Description>
            Progress updates highlight recent milestones and initiatives across federal agencies.
          </Collection.Description>
        </Collection.Item>
      </Collection.List>
    </Collection.Root>
  )
}
