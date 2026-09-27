import { Collection } from '@uswds-tailwind/react/collection'
import { Link } from '@uswds-tailwind/react/link'

export default function CollectionHeadingsDemo() {
  return (
    <Collection.Root>
      <Collection.List className="*:py-2">
        <Collection.Item>
          <Collection.Heading>
            <h4><Link href="#" isExternal>The eight principles of mobile-friendliness</Link></h4>
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
            <h4><Link href="#" isExternal>The USWDS maturity model</Link></h4>
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
            <h4><Link href="#" isExternal>A news item that's on our own site</Link></h4>
          </Collection.Heading>
        </Collection.Item>
        <Collection.Item>
          <Collection.Heading>
            <h4><Link href="#" isExternal>The key role of product owners in federated data projects</Link></h4>
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
            <h4><Link href="#" isExternal>Progress on Cross-Agency Priority (CAP) goals and Agency Priority Goals (APGs)</Link></h4>
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
  )
}
