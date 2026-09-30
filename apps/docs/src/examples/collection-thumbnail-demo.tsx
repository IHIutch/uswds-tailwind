import { Collection } from '@uswds-tailwind/react/collection'
import { Link } from '@uswds-tailwind/react/link'
import { Tag } from '@uswds-tailwind/react/tag'

export default function CollectionThumbnailDemo() {
  return (
    <Collection.Root>
      <Collection.List>
        <Collection.Item startElement={(
          <Collection.Thumbnail>
            <img src="https://uswds-tailwind.com/assets/images/preview.jpg" alt="" />
          </Collection.Thumbnail>
        )}
        >
          <Collection.Heading>
            <h4><Link href="#" isExternal>Gears of Government President's Award winners</Link></h4>
          </Collection.Heading>
          <Collection.Description>
            Today, the Administration announces the winners of the Gears of Government President's Award. This program recognizes contributions across the federal workforce.
          </Collection.Description>
          <Collection.MetaList aria-label="More information">
            <Collection.MetaListItem>By Sondra Ainsworth and Constance Lu</Collection.MetaListItem>
            <Collection.MetaListItem><time dateTime="2020-09-30">September 30, 2020</time></Collection.MetaListItem>
          </Collection.MetaList>
          <Collection.MetaList aria-label="Topics" className="flex-row">
            <Collection.MetaListItem><Tag variant="vivid-orange">NEW</Tag></Collection.MetaListItem>
            <Collection.MetaListItem><Tag variant="light-gray">PMA</Tag></Collection.MetaListItem>
            <Collection.MetaListItem><Tag variant="light-gray">OMB</Tag></Collection.MetaListItem>
          </Collection.MetaList>
        </Collection.Item>
        <Collection.Item startElement={(
          <Collection.Thumbnail>
            <img src="https://uswds-tailwind.com/assets/images/preview.jpg" alt="" />
          </Collection.Thumbnail>
        )}
        >
          <Collection.Heading>
            <h4><Link href="#" isExternal>Women-owned small business dashboard</Link></h4>
          </Collection.Heading>
          <Collection.Description>
            In honor of National Women's Small Business Month, this dashboard highlights data about women-owned small businesses.
          </Collection.Description>
          <Collection.MetaList aria-label="More information">
            <Collection.MetaListItem>By Constance Lu</Collection.MetaListItem>
            <Collection.MetaListItem><time dateTime="2020-09-30">September 30, 2020</time></Collection.MetaListItem>
          </Collection.MetaList>
          <Collection.MetaList aria-label="Topics" className="flex-row">
            <Collection.MetaListItem><Tag variant="light-gray">SBA</Tag></Collection.MetaListItem>
          </Collection.MetaList>
        </Collection.Item>
      </Collection.List>
    </Collection.Root>
  )
}
