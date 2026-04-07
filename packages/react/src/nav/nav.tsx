import type * as modal from '@uswds-tailwind/modal-compat'
import type { UseNavProps } from './use-nav'
import * as dropdown from '@uswds-tailwind/dropdown-compat'
import { mergeProps, normalizeProps, useMachine } from '@zag-js/react'
import * as React from 'react'
import { cx } from '../cva.config'
import { useNav } from './use-nav'

// Context

interface NavContextProps {
  api: modal.Api
}

const NavContext = React.createContext<NavContextProps | null>(null)

function useNavContext() {
  const context = React.useContext(NavContext)
  if (!context) {
    throw new Error('Nav components must be used within a Nav.Root')
  }
  return context
}

// Root

export type NavRootProps = UseNavProps & React.ComponentPropsWithoutRef<'div'>

const NavRoot = React.forwardRef<HTMLDivElement, NavRootProps>(
  ({ open, forceAction, className, ...props }, forwardedRef) => {
    const api = useNav({ open, forceAction })

    return (
      <NavContext.Provider value={{ api }}>
        <div
          {...props}
          className={cx('', className)}
          ref={forwardedRef}
        />
      </NavContext.Provider>
    )
  },
)

// MenuTrigger

export type NavTriggerProps = React.ComponentPropsWithoutRef<'button'>

const NavTrigger = React.forwardRef<HTMLButtonElement, NavTriggerProps>(
  ({ className, ...props }, forwardedRef) => {
    const { api } = useNavContext()
    const mergedProps = mergeProps(api.getTriggerProps(), props)

    return (
      <button
        {...mergedProps}
        className={cx(
          'cursor-pointer @desktop:hidden uppercase ml-auto leading-none text-white text-sm h-12 px-3 bg-blue-60v hover:bg-blue-warm-70v active:bg-blue-warm-80v focus:outline-4 focus:outline-blue-40v',
          className,
        )}
        ref={forwardedRef}
      />
    )
  },
)

// Backdrop

export type NavBackdropProps = React.ComponentPropsWithoutRef<'div'>

function NavBackdrop({ className, ...props }: NavBackdropProps) {
  const { api } = useNavContext()
  const mergedProps = mergeProps(api.getBackdropProps(), props)

  return (
    <div
      {...mergedProps}
      className={cx(
        '@desktop:hidden fixed z-40 inset-0 bg-black/70 animate-in duration-150 ease-in-out fade-in',
        className,
      )}
    />
  )
}

// Positioner

export type NavPositionerProps = React.ComponentPropsWithoutRef<'div'>

const NavPositioner = React.forwardRef<HTMLDivElement, NavPositionerProps>(
  ({ className, ...props }, forwardedRef) => {
    const { api } = useNavContext()
    const { style: _style, ...positionerProps } = mergeProps(api.getPositionerProps(), props)

    return (
      <div
        {...positionerProps}
        className={cx(
          '@max-desktop:fixed @max-desktop:inset-0 @max-desktop:z-50',
          '@max-desktop:not-data-[state=open]:pointer-events-none',
          '@desktop:static @desktop:contents',
          className,
        )}
        ref={forwardedRef}
      />
    )
  },
)

// Content

export type NavContentProps = React.ComponentPropsWithoutRef<'nav'>

const NavContent = React.forwardRef<HTMLElement, NavContentProps>(
  ({ className, ...props }, forwardedRef) => {
    const { api } = useNavContext()
    const { hidden, role, 'aria-modal': _ariaModal, tabIndex, ...contentProps } = mergeProps(api.getContentProps(), props)

    return (
      <nav
        {...contentProps}
        className={cx(
          // Mobile: slide-in drawer
          '@max-desktop:flex @max-desktop:flex-col @max-desktop:gap-6 @max-desktop:pt-16 @max-desktop:pb-4 @max-desktop:px-4 @max-desktop:bg-white @max-desktop:w-60 @max-desktop:fixed @max-desktop:right-0 @max-desktop:inset-y-0 @max-desktop:overflow-auto @max-desktop:animate-in @max-desktop:duration-300 @max-desktop:ease-in-out @max-desktop:slide-in-from-right',
          // Mobile: hide when closed via data-state
          '@max-desktop:not-data-[state=open]:hidden',
          // Desktop: inline nav (always visible)
          '@desktop:flex @desktop:justify-end @desktop:items-center @desktop:pl-2 @desktop:pb-1',
          className,
        )}
        ref={forwardedRef}
      />
    )
  },
)

// Close

export type NavCloseTriggerProps = React.ComponentPropsWithoutRef<'button'>

const NavCloseTrigger = React.forwardRef<HTMLButtonElement, NavCloseTriggerProps>(
  ({ className, children, ...props }, forwardedRef) => {
    const { api } = useNavContext()
    const mergedProps = mergeProps(api.getCloseTriggerProps(), props)

    return (
      <button
        {...mergedProps}
        aria-label="Close"
        className={cx(
          'cursor-pointer @desktop:hidden absolute top-0 right-0 size-12 flex items-center justify-center text-black bg-transparent focus:outline-4 focus:-outline-offset-4 focus:outline-blue-40v',
          className,
        )}
        ref={forwardedRef}
      >
        {children || (
          <div className="icon-[material-symbols--close] size-6" />
        )}
      </button>
    )
  },
)

// List

export type NavListProps = React.ComponentPropsWithoutRef<'ul'>

function NavList({ className, ...props }: NavListProps) {
  return (
    <ul
      {...props}
      className={cx(
        '@max-desktop:flex @max-desktop:flex-col',
        '@desktop:flex',
        className,
      )}
    />
  )
}

// ListItem

export type NavListItemProps = React.ComponentPropsWithoutRef<'li'>

function NavListItem({ className, ...props }: NavListItemProps) {
  return (
    <li
      {...props}
      className={cx(
        '@max-desktop:border-t @max-desktop:border-t-gray-10',
        'leading-none',
        className,
      )}
    />
  )
}

// Link

export type NavLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement>

const NavLink = React.forwardRef<HTMLAnchorElement, NavLinkProps>(
  ({ className, ...props }, forwardedRef) => {
    return (
      <a
        {...props}
        className={cx(
          'cursor-pointer p-4 flex @desktop:font-bold text-gray-cool-60 focus:outline-4 focus:outline-blue-40v hover:text-blue-60v',
          className,
        )}
        ref={forwardedRef}
      />
    )
  },
)

// Dropdown Context

interface NavDropdownContextProps {
  api: dropdown.Api
}

const NavDropdownContext = React.createContext<NavDropdownContextProps | null>(null)

function useNavDropdownContext() {
  const context = React.useContext(NavDropdownContext)
  if (!context) {
    throw new Error('Nav.DropdownTrigger/DropdownContent must be used within a Nav.Dropdown')
  }
  return context
}

// Dropdown

export type NavDropdownProps = Omit<dropdown.Props, 'id'> & React.ComponentPropsWithoutRef<'div'>

function NavDropdown({ className, ...props }: NavDropdownProps) {
  const service = useMachine(dropdown.machine, {
    id: React.useId(),
    ...props,
  })
  const api = dropdown.connect(service, normalizeProps)
  const mergedProps = mergeProps(api.getRootProps(), props)

  return (
    <NavDropdownContext.Provider value={{ api }}>
      <div
        {...mergedProps}
        className={cx('relative', className)}
      />
    </NavDropdownContext.Provider>
  )
}

// DropdownTrigger

export type NavDropdownTriggerProps = React.ComponentPropsWithoutRef<'button'> & {
  isCurrent?: boolean
}

const NavDropdownTrigger = React.forwardRef<HTMLButtonElement, NavDropdownTriggerProps>(
  ({ className, isCurrent, ...props }, forwardedRef) => {
    const { api } = useNavDropdownContext()
    const mergedProps = mergeProps(api.getTriggerProps(), props)

    return (
      <button
        data-current={isCurrent || undefined}
        {...mergedProps}
        className={cx(
          // base
          'relative text-gray-60 cursor-pointer text-left flex items-center justify-between gap-3 leading-none ',
          // :after
          'data-current:after:block data-current:after:absolute data-current:after:bg-blue-60v',
          // Mobile
          '@max-desktop:w-full py-3 pl-4 @max-desktop:hover:bg-gray-5',
          // current
          '@max-desktop:data-current:text-blue-60v @max-desktop:data-current:font-bold @max-desktop:data-current:after:inset-y-1 @max-desktop:data-current:after:left-1 @max-desktop:data-current:after:w-1 @max-desktop:data-current:after:rounded-full',
          // focus
          'focus:z-10 focus:outline-4 focus:outline-blue-40v',
          // Desktop
          '@desktop:font-bold @desktop:gap-1 @desktop:p-4 @desktop:data-[state=open]:bg-blue-warm-80v @desktop:data-[state=open]:text-white @desktop:hover:text-blue-60v @desktop:hover:after:bg-blue-60v',
          // desktop:after
          '@desktop:data-current:after:-bottom-1 @desktop:data-current:after:inset-x-4 @desktop:data-current:after:h-1 @desktop:hover:after:absolute @desktop:hover:after:-bottom-1 @desktop:hover:after:inset-x-4 @desktop:hover:after:h-1 @desktop:data-[state=open]:after:hidden',
          className,
        )}
        ref={forwardedRef}
      />
    )
  },
)

// DropdownContent

export type NavDropdownContentProps = React.ComponentPropsWithoutRef<'ul'>

const NavDropdownContent = React.forwardRef<HTMLUListElement, NavDropdownContentProps>(
  ({ className, ...props }, forwardedRef) => {
    const { api } = useNavDropdownContext()
    const mergedProps = mergeProps(api.getContentProps(), props)

    return (
      <ul
        {...mergedProps}
        className={cx(
          'leading-snug z-10',
          '@desktop:bg-blue-warm-80v @desktop:py-2 @desktop:w-60 @desktop:absolute',
          className,
        )}
        ref={forwardedRef}
      />
    )
  },
)

// DropdownItem

export type NavDropdownItemProps = React.ComponentPropsWithoutRef<'li'>

const NavDropdownItem = React.forwardRef<HTMLLIElement, NavDropdownItemProps>(
  ({ className, ...props }, forwardedRef) => {
    const { api } = useNavDropdownContext()
    const mergedProps = mergeProps(api.getItemProps(), props)

    return (
      <li
        {...mergedProps}
        className={cx('@max-desktop:border-t @max-desktop:border-t-gray-10', className)}
        ref={forwardedRef}
      />
    )
  },
)

// DropdownLink

export type NavDropdownLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement>

const NavDropdownLink = React.forwardRef<HTMLAnchorElement, NavDropdownLinkProps>(
  ({ className, ...props }, forwardedRef) => {
    return (
      <a
        {...props}
        className={cx(
          'block cursor-pointer py-2 pl-8 pr-4 text-gray-60 @max-desktop:hover:text-blue-60v @max-desktop:hover:bg-gray-5 focus:outline-4 focus:-outline-offset-4 focus:outline-blue-40v',
          '@desktop:text-white @desktop:px-4 @desktop:hover:underline',
          className,
        )}
        ref={forwardedRef}
      />
    )
  },
)

// DropdownIndicator

export type NavDropdownIndicatorProps = React.ComponentPropsWithoutRef<'div'>

function NavDropdownIndicator({ className, children, ...props }: NavDropdownIndicatorProps) {
  const { api } = useNavDropdownContext()
  const mergedProps = mergeProps(api.getIndicatorProps(), props)

  return (
    <div
      {...mergedProps}
      aria-hidden="true"
      className={cx('group h-full flex items-center ml-auto shrink-0', className)}
    >
      {children || (
        <span className={cx(
          'size-5 text-black icon-[material-symbols--add] group-data-[state=open]:icon-[material-symbols--remove]',
          '@desktop:size-4 @desktop:text-current @desktop:icon-[material-symbols--keyboard-arrow-down] @desktop:group-data-[state=open]:icon-[material-symbols--keyboard-arrow-up]',
        )}
        />
      )}
    </div>
  )
}

// Display names

NavRoot.displayName = 'Nav.Root'
NavTrigger.displayName = 'Nav.Trigger'
NavBackdrop.displayName = 'Nav.Backdrop'
NavPositioner.displayName = 'Nav.Positioner'
NavContent.displayName = 'Nav.Content'
NavCloseTrigger.displayName = 'Nav.CloseTrigger'
NavList.displayName = 'Nav.List'
NavListItem.displayName = 'Nav.ListItem'
NavLink.displayName = 'Nav.Link'
NavDropdown.displayName = 'Nav.Dropdown'
NavDropdownTrigger.displayName = 'Nav.DropdownTrigger'
NavDropdownContent.displayName = 'Nav.DropdownContent'
NavDropdownItem.displayName = 'Nav.DropdownItem'
NavDropdownLink.displayName = 'Nav.DropdownLink'
NavDropdownIndicator.displayName = 'Nav.DropdownIndicator'

export const Nav = {
  Root: NavRoot,
  Trigger: NavTrigger,
  Backdrop: NavBackdrop,
  Positioner: NavPositioner,
  Content: NavContent,
  CloseTrigger: NavCloseTrigger,
  List: NavList,
  ListItem: NavListItem,
  Link: NavLink,
  Dropdown: NavDropdown,
  DropdownTrigger: NavDropdownTrigger,
  DropdownContent: NavDropdownContent,
  DropdownItem: NavDropdownItem,
  DropdownLink: NavDropdownLink,
  DropdownIndicator: NavDropdownIndicator,
}
