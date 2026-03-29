import * as React from 'react'
import { cx } from '../cva.config'

interface SideNavigationItemBase {
  label: string
  href: string
}

export type SideNavigationItem
  = | (SideNavigationItemBase & { isCurrent?: boolean, items?: never })
    | (SideNavigationItemBase & { isCurrent?: never, items: SideNavigationItem[] })

type SideNavigationRootProps = React.ComponentPropsWithoutRef<'nav'>

function SideNavigationRoot({ className, children, ...props }: SideNavigationRootProps) {
  return (
    <nav {...props} className={cx('border-b border-b-gray-10 [&_ul_ul_a]:pl-8 [&_ul_ul_ul_a]:pl-12 [&>ul>li:has([aria-current=page])>a]:after:block [&>ul>li:has([aria-current=page])>a]:after:absolute [&>ul>li:has([aria-current=page])>a]:after:bg-blue-60v [&>ul>li:has([aria-current=page])>a]:after:inset-y-1 [&>ul>li:has([aria-current=page])>a]:after:left-0 [&>ul>li:has([aria-current=page])>a]:after:w-1 [&>ul>li:has([aria-current=page])>a]:after:rounded-full [&>ul>li:has([aria-current=page])>a]:text-blue-60v [&>ul>li:has([aria-current=page])>a]:font-bold', className)}>
      {children}
    </nav>
  )
}

type SideNavigationListProps = React.HTMLAttributes<HTMLUListElement>

function SideNavigationList({ className, ...props }: SideNavigationListProps) {
  return (
    <ul
      {...props}
      className={cx('', className)}
    />
  )
}

type SideNavigationListItemProps = React.HTMLAttributes<HTMLLIElement>

function SideNavigationListItem({ className, ...props }: SideNavigationListItemProps) {
  return (
    <li
      {...props}
      className={cx('border-t border-t-gray-10', className)}
    />
  )
}

type SideNavigationLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  isCurrent?: boolean
}

function SideNavigationLink({ className, isCurrent, ...props }: SideNavigationLinkProps) {
  return (
    <a
      {...props}
      aria-current={isCurrent ? 'page' : undefined}
      className={cx(
        'block relative py-2 px-4 text-gray-60 hover:text-blue-60v hover:bg-gray-5 focus:outline-4 focus:outline-offset-0 focus:outline-blue-40v aria-[current=page]:text-blue-60v aria-[current=page]:font-bold',
        className,
      )}
    />
  )
}

interface SideNavigationItemsProps {
  items: SideNavigationItem[]
}

function SideNavigationItems({ items }: SideNavigationItemsProps) {
  return (
    <SideNavigationList>
      {items.map(item => (
        <SideNavigationListItem key={item.href}>
          <SideNavigationLink href={item.href} isCurrent={item.isCurrent}>
            {item.label}
          </SideNavigationLink>
          {item.items ? <SideNavigationItems items={item.items} /> : null}
        </SideNavigationListItem>
      ))}
    </SideNavigationList>
  )
}

SideNavigationRoot.displayName = 'SideNavigation.Root'
SideNavigationList.displayName = 'SideNavigation.List'
SideNavigationListItem.displayName = 'SideNavigation.ListItem'
SideNavigationLink.displayName = 'SideNavigation.Link'
SideNavigationItems.displayName = 'SideNavigation.Items'

export const SideNavigation = {
  Root: SideNavigationRoot,
  List: SideNavigationList,
  ListItem: SideNavigationListItem,
  Link: SideNavigationLink,
  Items: SideNavigationItems,
}
