import { SideNavigation } from '@uswds-tailwind/react/side-navigation'

export default function SideNavigationDemo() {
  return (
    <SideNavigation.Root aria-label="Program navigation" className="max-w-64">
      <SideNavigation.List>
        <SideNavigation.ListItem><SideNavigation.Link href="#overview" isCurrent>Overview</SideNavigation.Link></SideNavigation.ListItem>
        <SideNavigation.ListItem>
          <SideNavigation.Link href="#eligibility">Eligibility</SideNavigation.Link>
          <SideNavigation.List>
            <SideNavigation.ListItem><SideNavigation.Link href="#requirements">Requirements</SideNavigation.Link></SideNavigation.ListItem>
            <SideNavigation.ListItem><SideNavigation.Link href="#exceptions">Exceptions</SideNavigation.Link></SideNavigation.ListItem>
          </SideNavigation.List>
        </SideNavigation.ListItem>
      </SideNavigation.List>
    </SideNavigation.Root>
  )
}
