import preview from '../../.storybook/preview'
import { Link } from '../link'
import { Tag } from '../tag'
import { Collection } from './collection'

const meta = preview.meta({
  title: 'Components/Collection',
  component: Collection.Root,
})

export const Default = meta.story({
  render: () => (
    <Collection.Root>
      <Collection.List>
        <Collection.Item>
          <Collection.Heading>
            <h4>
              <Link href="#" isExternal>Gears of Government President's Award winners</Link>
            </h4>
          </Collection.Heading>
          <Collection.Description>
            Today, the Administration announces the winners of the Gears of Government President's Award. This program recognizes the contributions of individuals and teams across the federal workforce who make a profound difference in the lives of the American people.
          </Collection.Description>
          <Collection.MetaList aria-label="More information">
            <Collection.MetaListItem>By Sondra Ainsworth and Constance Lu</Collection.MetaListItem>
            <Collection.MetaListItem>
              <time>September 30, 2020</time>
            </Collection.MetaListItem>
          </Collection.MetaList>
          <Collection.MetaList aria-label="Topics" className="flex-row flex-wrap">
            <Collection.MetaListItem>
              <Tag className="bg-orange-50v">NEW</Tag>
            </Collection.MetaListItem>
            <Collection.MetaListItem>
              <Tag className="bg-gray-10 text-ink">PMA</Tag>
            </Collection.MetaListItem>
            <Collection.MetaListItem>
              <Tag className="bg-gray-10 text-ink">OMB</Tag>
            </Collection.MetaListItem>
          </Collection.MetaList>
        </Collection.Item>
        <Collection.Item>
          <Collection.Heading>
            <h4>
              <Link href="#" isExternal>Women-owned small business dashboard</Link>
            </h4>
          </Collection.Heading>
          <Collection.Description>
            In honor of National Women's Small Business Month, we've partnered with SBA's Office of Government Contracting and Business Development and Office of Program Performance, Analysis, and Evaluation to highlight the Women-Owned Small Businesses (WOSBs) data dashboard!
          </Collection.Description>
          <Collection.MetaList aria-label="More information">
            <Collection.MetaListItem>By Constance Lu</Collection.MetaListItem>
            <Collection.MetaListItem>
              <time>September 30, 2020</time>
            </Collection.MetaListItem>
          </Collection.MetaList>
          <Collection.MetaList aria-label="Topics" className="flex-row flex-wrap">
            <Collection.MetaListItem>
              <Tag className="bg-gray-10 text-ink">SBA</Tag>
            </Collection.MetaListItem>
          </Collection.MetaList>
        </Collection.Item>
        <Collection.Item>
          <Collection.Heading>
            <h4>
              <Link href="#" isExternal>September 2020 updates show progress on cross-agency and agency priority goals</Link>
            </h4>
          </Collection.Heading>
          <Collection.Description>
            Today, we published progress updates for both Cross-Agency Priority (CAP) Goals and Agency Priority Goals (APGs) for the third quarter of FY2020. These updates highlight recent milestones and accomplishments as well as related initiatives that support progress towards a more modern and effective government.
          </Collection.Description>
          <Collection.MetaList aria-label="More information">
            <Collection.MetaListItem>By Eric L. Miller</Collection.MetaListItem>
            <Collection.MetaListItem>
              <time>September 17, 2020</time>
            </Collection.MetaListItem>
          </Collection.MetaList>
          <Collection.MetaList aria-label="Topics" className="flex-row flex-wrap">
            <Collection.MetaListItem>
              <Tag className="bg-gray-10 text-ink">QUARTERLY UPDATE</Tag>
            </Collection.MetaListItem>
            <Collection.MetaListItem>
              <Tag className="bg-gray-10 text-ink">CAP GOAL</Tag>
            </Collection.MetaListItem>
            <Collection.MetaListItem>
              <Tag className="bg-gray-10 text-ink">APG</Tag>
            </Collection.MetaListItem>
            <Collection.MetaListItem>
              <Tag className="bg-gray-10 text-ink">PMA</Tag>
            </Collection.MetaListItem>
            <Collection.MetaListItem>
              <Tag className="bg-gray-10 text-ink">SUCCESS STORY</Tag>
            </Collection.MetaListItem>
          </Collection.MetaList>
        </Collection.Item>
      </Collection.List>
    </Collection.Root>
  ),
})

export const HeadingsOnly = meta.story({
  render: () => (
    <Collection.Root>
      <Collection.List className="*:py-2">
        <Collection.Item>
          <Collection.Heading>
            <h4>
              <Link href="#" isExternal>The eight principles of mobile-friendliness</Link>
            </h4>
          </Collection.Heading>
          <Collection.MetaList aria-label="More information">
            <Collection.MetaListItem>
              <div className="flex items-center gap-1">
                <div className="icon-[material-symbols--globe] size-4" />
                <span>Digital.gov</span>
              </div>
            </Collection.MetaListItem>
          </Collection.MetaList>
        </Collection.Item>
        <Collection.Item>
          <Collection.Heading>
            <h4>
              <Link href="#" isExternal>The USWDS maturity model</Link>
            </h4>
          </Collection.Heading>
          <Collection.MetaList aria-label="More information">
            <Collection.MetaListItem>
              <div className="flex items-center gap-1">
                <div className="icon-[material-symbols--globe] size-4" />
                <span>U.S. Web Design System</span>
              </div>
            </Collection.MetaListItem>
          </Collection.MetaList>
        </Collection.Item>
        <Collection.Item>
          <Collection.Heading>
            <h4>
              <Link href="#" isExternal>A news item that's on our own site</Link>
            </h4>
          </Collection.Heading>
        </Collection.Item>
        <Collection.Item>
          <Collection.Heading>
            <h4>
              <Link href="#" isExternal>The key role of product owners in federated data projects</Link>
            </h4>
          </Collection.Heading>
          <Collection.MetaList aria-label="More information">
            <Collection.MetaListItem>
              <div className="flex items-center gap-1">
                <div className="icon-[material-symbols--globe] size-4" />
                <span>18F</span>
              </div>
            </Collection.MetaListItem>
          </Collection.MetaList>
        </Collection.Item>
        <Collection.Item>
          <Collection.Heading>
            <h4>
              <Link href="#" isExternal>Progress on Cross-Agency Priority (CAP) goals and Agency Priority Goals (APGs)</Link>
            </h4>
          </Collection.Heading>
          <Collection.MetaList aria-label="More information">
            <Collection.MetaListItem>
              <div className="flex items-center gap-1">
                <div className="icon-[material-symbols--globe] size-4" />
                <span>Performance.gov</span>
              </div>
            </Collection.MetaListItem>
          </Collection.MetaList>
        </Collection.Item>
      </Collection.List>
    </Collection.Root>
  ),
})

export const WithCalendar = meta.story({
  render: () => (
    <Collection.Root>
      <Collection.List>
        <Collection.Item startElement={(
          <Collection.Calendar dateTime={new Date('2020-09-30')}>
            <Collection.CalendarMonth />
            <Collection.CalendarDate />
          </Collection.Calendar>
        )}
        >
          <Collection.Heading>
            <h4>
              <Link href="#" isExternal>Gears of Government President's Award winners</Link>
            </h4>
          </Collection.Heading>
          <Collection.Description>
            Today, the Administration announces the winners of the Gears of Government President's Award. This program recognizes the contributions of individuals and teams across the federal workforce who make a profound difference in the lives of the American people.
          </Collection.Description>
        </Collection.Item>
        <Collection.Item startElement={(
          <Collection.Calendar dateTime={new Date('2020-09-30')}>
            <Collection.CalendarMonth />
            <Collection.CalendarDate />
          </Collection.Calendar>
        )}
        >
          <Collection.Heading>
            <h4>
              <Link href="#" isExternal>Women-owned small business dashboard</Link>
            </h4>
          </Collection.Heading>
          <Collection.Description>
            In honor of National Women's Small Business Month, we've partnered with SBA's Office of Government Contracting and Business Development and Office of Program Performance, Analysis, and Evaluation to highlight the Women-Owned Small Businesses (WOSBs) data dashboard!
          </Collection.Description>
        </Collection.Item>
        <Collection.Item startElement={(
          <Collection.Calendar dateTime={new Date('2020-09-17')}>
            <Collection.CalendarMonth />
            <Collection.CalendarDate />
          </Collection.Calendar>
        )}
        >
          <Collection.Heading>
            <h4>
              <Link href="#" isExternal>September 2020 updates show progress on cross-agency and agency priority goals</Link>
            </h4>
          </Collection.Heading>
          <Collection.Description>
            Today, we published progress updates for both Cross-Agency Priority (CAP) Goals and Agency Priority Goals (APGs) for the third quarter of FY2020. These updates highlight recent milestones and accomplishments as well as related initiatives that support progress towards a more modern and effective government.
          </Collection.Description>
        </Collection.Item>
      </Collection.List>
    </Collection.Root>
  ),
})

export const WithThumbnail = meta.story({
  render: () => (
    <Collection.Root>
      <Collection.List>
        <Collection.Item startElement={(
          <Collection.Thumbnail>
            <img src="https://trumpadministration.archives.performance.gov/img/GoG/GoG-logo.png" alt="Gears of Government Awards - President's Award" />
          </Collection.Thumbnail>
        )}
        >
          <Collection.Heading>
            <h4>
              <Link href="#" isExternal>Gears of Government President's Award winners</Link>
            </h4>
          </Collection.Heading>
          <Collection.Description>
            Today, the Administration announces the winners of the Gears of Government President's Award. This program recognizes the contributions of individuals and teams across the federal workforce who make a profound difference in the lives of the American people.
          </Collection.Description>
          <Collection.MetaList aria-label="More information">
            <Collection.MetaListItem>By Sondra Ainsworth and Constance Lu</Collection.MetaListItem>
            <Collection.MetaListItem>
              <time>September 30, 2020</time>
            </Collection.MetaListItem>
          </Collection.MetaList>
          <Collection.MetaList aria-label="Topics" className="flex-row flex-wrap">
            <Collection.MetaListItem>
              <Tag className="bg-orange-50v">NEW</Tag>
            </Collection.MetaListItem>
            <Collection.MetaListItem>
              <Tag className="bg-gray-10 text-ink">PMA</Tag>
            </Collection.MetaListItem>
            <Collection.MetaListItem>
              <Tag className="bg-gray-10 text-ink">OMB</Tag>
            </Collection.MetaListItem>
          </Collection.MetaList>
        </Collection.Item>
        <Collection.Item startElement={(
          <Collection.Thumbnail>
            <img src="https://www.performance.gov/img/blog/wosb1.jpg" alt="Woman Owned Small Business Federal Contracts" />
          </Collection.Thumbnail>
        )}
        >
          <Collection.Heading>
            <h4>
              <Link href="#" isExternal>Women-owned small business dashboard</Link>
            </h4>
          </Collection.Heading>
          <Collection.Description>
            In honor of National Women's Small Business Month, we've partnered with SBA's Office of Government Contracting and Business Development and Office of Program Performance, Analysis, and Evaluation to highlight the Women-Owned Small Businesses (WOSBs) data dashboard!
          </Collection.Description>
          <Collection.MetaList aria-label="More information">
            <Collection.MetaListItem>By Constance Lu</Collection.MetaListItem>
            <Collection.MetaListItem>
              <time>September 30, 2020</time>
            </Collection.MetaListItem>
          </Collection.MetaList>
          <Collection.MetaList aria-label="Topics" className="flex-row flex-wrap">
            <Collection.MetaListItem>
              <Tag className="bg-gray-10 text-ink">SBA</Tag>
            </Collection.MetaListItem>
          </Collection.MetaList>
        </Collection.Item>
        <Collection.Item startElement={(
          <Collection.Thumbnail>
            <img src="https://www.performance.gov/img/blog/sept-2020.png" alt="September 2020 Updates" />
          </Collection.Thumbnail>
        )}
        >
          <Collection.Heading>
            <h4>
              <Link href="#" isExternal>September 2020 updates show progress on cross-agency and agency priority goals</Link>
            </h4>
          </Collection.Heading>
          <Collection.Description>
            Today, we published progress updates for both Cross-Agency Priority (CAP) Goals and Agency Priority Goals (APGs) for the third quarter of FY2020. These updates highlight recent milestones and accomplishments as well as related initiatives that support progress towards a more modern and effective government.
          </Collection.Description>
          <Collection.MetaList aria-label="More information">
            <Collection.MetaListItem>By Eric L. Miller</Collection.MetaListItem>
            <Collection.MetaListItem>
              <time>September 17, 2020</time>
            </Collection.MetaListItem>
          </Collection.MetaList>
          <Collection.MetaList aria-label="Topics" className="flex-row flex-wrap">
            <Collection.MetaListItem>
              <Tag className="bg-gray-10 text-ink">QUARTERLY UPDATE</Tag>
            </Collection.MetaListItem>
            <Collection.MetaListItem>
              <Tag className="bg-gray-10 text-ink">CAP GOAL</Tag>
            </Collection.MetaListItem>
            <Collection.MetaListItem>
              <Tag className="bg-gray-10 text-ink">APG</Tag>
            </Collection.MetaListItem>
            <Collection.MetaListItem>
              <Tag className="bg-gray-10 text-ink">PMA</Tag>
            </Collection.MetaListItem>
            <Collection.MetaListItem>
              <Tag className="bg-gray-10 text-ink">SUCCESS STORY</Tag>
            </Collection.MetaListItem>
          </Collection.MetaList>
        </Collection.Item>
      </Collection.List>
    </Collection.Root>
  ),
})
