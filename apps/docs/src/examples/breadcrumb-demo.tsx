import { Breadcrumb } from '@uswds-tailwind/react/breadcrumb'

export default function BreadcrumbDemo() {
  return (
    <Breadcrumb.Root wrap={false} aria-label="Breadcrumb">
      <Breadcrumb.Previous />
      <Breadcrumb.List>
        <Breadcrumb.Item>
          <Breadcrumb.Link href="#">Home</Breadcrumb.Link>
          <Breadcrumb.Separator />
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Breadcrumb.Link href="#">Federal Contracting</Breadcrumb.Link>
          <Breadcrumb.Separator />
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Breadcrumb.Link href="#">Contracting assistance programs</Breadcrumb.Link>
          <Breadcrumb.Separator />
        </Breadcrumb.Item>
        <Breadcrumb.Item isCurrent>
          <Breadcrumb.Link>Economically disadvantaged women-owned small business federal contracting program</Breadcrumb.Link>
        </Breadcrumb.Item>
      </Breadcrumb.List>
    </Breadcrumb.Root>
  )
}
