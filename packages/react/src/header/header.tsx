import type * as collapse from '@uswds-tailwind/collapse-compat'
import type * as modal from '@uswds-tailwind/modal-compat'
import type { UseHeaderProps } from './use-header'
import { mergeProps } from '@zag-js/react'
import * as React from 'react'
import { cx } from '../cva.config'
import { useHeader, useHeaderNavMenu } from './use-header'

// Context

interface HeaderContextProps {
  api: modal.Api
}

const HeaderContext = React.createContext<HeaderContextProps | null>(null)

function useHeaderContext() {
  const context = React.useContext(HeaderContext)
  if (!context) {
    throw new Error('Header components must be used within a Header.Root')
  }
  return context
}

// Root

export type HeaderRootProps = UseHeaderProps & React.ComponentPropsWithoutRef<'header'>

const HeaderRoot = React.forwardRef<HTMLElement, HeaderRootProps>(
  ({ open, forceAction, className, ...props }, forwardedRef) => {
    const api = useHeader({ open, forceAction })

    return (
      <HeaderContext.Provider value={{ api }}>
        <header
          {...props}
          className={cx(className)}
          ref={forwardedRef}
        />
      </HeaderContext.Provider>
    )
  },
)

// Container

export type HeaderContainerProps = React.ComponentPropsWithoutRef<'div'>

function HeaderContainer({ className, ...props }: HeaderContainerProps) {
  return (
    <div
      {...props}
      className={cx('@container', className)}
    />
  )
}

// Branding

export type HeaderBrandingProps = React.ComponentPropsWithoutRef<'div'>

function HeaderBranding({ className, ...props }: HeaderBrandingProps) {
  return (
    <div
      {...props}
      className={cx('@desktop:text-2xl @desktop:mt-8 @desktop:mb-4 ml-4 @desktop:ml-0 @desktop:w-1/3 w-full', className)}
    />
  )
}

// MenuTrigger

export type HeaderMenuTriggerProps = React.ComponentPropsWithoutRef<'button'>

const HeaderMenuTrigger = React.forwardRef<HTMLButtonElement, HeaderMenuTriggerProps>(
  ({ className, children, ...props }, forwardedRef) => {
    const { api } = useHeaderContext()
    const mergedProps = mergeProps(api.getTriggerProps(), props)

    return (
      <button
        {...mergedProps}
        className={cx(
          '@desktop:hidden uppercase ml-auto leading-none text-white text-sm h-12 px-3 bg-blue-60v hover:bg-blue-warm-70v active:bg-blue-warm-80v focus:outline-4 focus:outline-blue-40v',
          className,
        )}
        ref={forwardedRef}
      >
        {children || 'Menu'}
      </button>
    )
  },
)

// Backdrop

export type HeaderBackdropProps = React.ComponentPropsWithoutRef<'div'>

function HeaderBackdrop({ className, ...props }: HeaderBackdropProps) {
  const { api } = useHeaderContext()
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

// NavPositioner

export type HeaderNavPositionerProps = React.ComponentPropsWithoutRef<'div'>

const HeaderNavPositioner = React.forwardRef<HTMLDivElement, HeaderNavPositionerProps>(
  ({ className, ...props }, forwardedRef) => {
    const { api } = useHeaderContext()
    const { style: _style, ...positionerProps } = mergeProps(api.getPositionerProps(), props)

    return (
      <div
        {...positionerProps}
        className={cx(
          // Mobile: fixed overlay
          '@max-desktop:fixed @max-desktop:inset-0 @max-desktop:z-50',
          '@max-desktop:not-data-[state=open]:pointer-events-none',
          // Desktop: inline, no layout impact
          '@desktop:static @desktop:contents',
          className,
        )}
        ref={forwardedRef}
      />
    )
  },
)

// NavContent

export type HeaderNavContentProps = React.ComponentPropsWithoutRef<'nav'>

const HeaderNavContent = React.forwardRef<HTMLElement, HeaderNavContentProps>(
  ({ className, ...props }, forwardedRef) => {
    const { api } = useHeaderContext()
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

// NavClose

export type HeaderNavCloseProps = React.ComponentPropsWithoutRef<'button'>

const HeaderNavClose = React.forwardRef<HTMLButtonElement, HeaderNavCloseProps>(
  ({ className, children, ...props }, forwardedRef) => {
    const { api } = useHeaderContext()
    const mergedProps = mergeProps(api.getCloseTriggerProps(), props)

    return (
      <button
        {...mergedProps}
        aria-label="Close"
        className={cx(
          '@desktop:hidden absolute top-0 right-0 size-12 flex items-center justify-center text-black bg-transparent focus:outline-4 focus:-outline-offset-4 focus:outline-blue-40v',
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

// NavList

export type HeaderNavListProps = React.ComponentPropsWithoutRef<'ul'>

function HeaderNavList({ className, ...props }: HeaderNavListProps) {
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

// NavItem

export type HeaderNavListItemProps = React.ComponentPropsWithoutRef<'li'>

function HeaderNavListItem({ className, ...props }: HeaderNavListItemProps) {
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

// NavLink

export type HeaderNavLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement>

const HeaderNavLink = React.forwardRef<HTMLAnchorElement, HeaderNavLinkProps>(
  ({ className, ...props }, forwardedRef) => {
    return (
      <a
        {...props}
        className={cx(
          'block cursor-pointer py-3 px-4 leading-none text-gray-60 hover:text-blue-60v hover:bg-gray-5 focus:outline-4 focus:outline-blue-40v',
          // '@max-desktop:block @max-desktop:py-3 @max-desktop:px-4 @max-desktop:text-gray-60 @max-desktop:hover:text-blue-60v @max-desktop:hover:bg-gray-5',
          // '@desktop:p-4 @desktop:flex font-bold @desktop:text-gray-cool-60 focus:outline-4 focus:outline-blue-40v @desktop:hover:text-blue-60v',
          className,
        )}
        ref={forwardedRef}
      />
    )
  },
)

// Megamenu

export type HeaderMegamenuProps = React.ComponentPropsWithoutRef<'div'>

function HeaderMegamenu({ className, ...props }: HeaderMegamenuProps) {
  return (
    <div
      {...props}
      className={cx('outline-hidden z-10 bg-blue-warm-80v py-4 px-8 leading-snug', className)}
    />
  )
}

// MegamenuList

export type HeaderMegamenuListProps = React.ComponentPropsWithoutRef<'ul'>

function HeaderMegamenuList({ className, ...props }: HeaderMegamenuListProps) {
  return (
    <ul
      {...props}
      className={cx('space-y-2', className)}
    />
  )
}

// MegamenuItem

export type HeaderMegamenuItemProps = React.ComponentPropsWithoutRef<'li'>

function HeaderMegamenuItem({ className, ...props }: HeaderMegamenuItemProps) {
  return (
    <li
      {...props}
      className={cx(className)}
    />
  )
}

// NavMenu Context

interface HeaderNavMenuContextProps {
  api: collapse.Api
}

const HeaderNavMenuContext = React.createContext<HeaderNavMenuContextProps | null>(null)

function useHeaderNavMenuContext() {
  const context = React.useContext(HeaderNavMenuContext)
  if (!context) {
    throw new Error('Header.NavMenuTrigger/NavMenuContent must be used within a Header.NavMenu')
  }
  return context
}

// NavMenu

export type HeaderNavMenuProps = React.ComponentPropsWithoutRef<'div'>

function HeaderNavMenu({ className, ...props }: HeaderNavMenuProps) {
  const api = useHeaderNavMenu()
  const mergedProps = mergeProps(api.getRootProps(), props)
  const rootRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (!api.isOpen)
      return

    function handleClickOutside(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        api.setOpen(false)
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [api, api.isOpen])

  return (
    <HeaderNavMenuContext.Provider value={{ api }}>
      <div
        ref={rootRef}
        {...mergedProps}
        className={cx('relative', className)}
      />
    </HeaderNavMenuContext.Provider>
  )
}

// NavMenuTrigger

export type HeaderNavMenuTriggerProps = React.ComponentPropsWithoutRef<'button'> & {
  isCurrent?: boolean
}

const HeaderNavMenuTrigger = React.forwardRef<HTMLButtonElement, HeaderNavMenuTriggerProps>(
  ({ className, ...props }, forwardedRef) => {
    const { api } = useHeaderNavMenuContext()
    const mergedProps = mergeProps(api.getTriggerProps(), {
      'data-current': props.isCurrent,
      ...props,
    })

    return (
      <button
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

// NavMenuContent

export type HeaderNavMenuContentProps = React.ComponentPropsWithoutRef<'ul'>

const HeaderNavMenuContent = React.forwardRef<HTMLUListElement, HeaderNavMenuContentProps>(
  ({ className, ...props }, forwardedRef) => {
    const { api } = useHeaderNavMenuContext()
    const { hidden, ...contentProps } = mergeProps(api.getContentProps(), props)

    return (
      <ul
        {...contentProps}
        className={cx(
          'not-data-[state=open]:hidden leading-snug z-10',
          '@desktop:bg-blue-warm-80v @desktop:py-2 @desktop:w-60 @desktop:absolute',
          // 'not-data-[state=open]:hidden @desktop:absolute z-10',
          className,
        )}
        ref={forwardedRef}
      />
    )
  },
)

// NavMenuItem

export type HeaderNavMenuItemProps = React.ComponentPropsWithoutRef<'li'>

function HeaderNavMenuItem({ className, ...props }: HeaderNavMenuItemProps) {
  return (
    <li
      {...props}
      className={cx('@max-desktop:border-t @max-desktop:border-t-gray-10', className)}
    />
  )
}

// NavMenuLink

export type HeaderNavMenuLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement>

const HeaderNavMenuLink = React.forwardRef<HTMLAnchorElement, HeaderNavMenuLinkProps>(
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

// NavMenuIndicator

export type HeaderNavMenuIndicatorProps = Omit<React.ComponentPropsWithoutRef<'div'>, 'children'> & {
  children?: React.ReactNode | ((context: HeaderNavMenuContextProps) => React.ReactNode)
}

function HeaderNavMenuIndicator({ className, children, ...props }: HeaderNavMenuIndicatorProps) {
  const context = useHeaderNavMenuContext()
  const content = typeof children === 'function'
    ? children(context)
    : children

  return (
    <div
      {...props}
      data-state={context.api.isOpen ? 'open' : undefined}
      aria-hidden="true"
      className={cx('group h-full flex items-center ml-auto shrink-0', className)}
    >
      {content || (
        <span className={cx(
          // mobile
          'size-5 text-black icon-[material-symbols--add] group-data-[state=open]:icon-[material-symbols--remove]',
          // desktop
          '@desktop:size-4 @desktop:text-current @desktop:icon-[material-symbols--keyboard-arrow-down] @desktop:group-data-[state=open]:icon-[material-symbols--keyboard-arrow-up]',
        )}
        />
      )}
    </div>
  )
}

// Display names

HeaderRoot.displayName = 'Header.Root'
HeaderContainer.displayName = 'Header.Container'
HeaderBranding.displayName = 'Header.Branding'
HeaderMenuTrigger.displayName = 'Header.MenuTrigger'
HeaderBackdrop.displayName = 'Header.Backdrop'
HeaderNavPositioner.displayName = 'Header.NavPositioner'
HeaderNavContent.displayName = 'Header.NavContent'
HeaderNavClose.displayName = 'Header.NavClose'
HeaderNavList.displayName = 'Header.NavList'
HeaderNavListItem.displayName = 'Header.NavListItem'
HeaderNavLink.displayName = 'Header.NavLink'
HeaderMegamenu.displayName = 'Header.Megamenu'
HeaderMegamenuList.displayName = 'Header.MegamenuList'
HeaderMegamenuItem.displayName = 'Header.MegamenuItem'
HeaderNavMenu.displayName = 'Header.NavMenu'
HeaderNavMenuTrigger.displayName = 'Header.NavMenuTrigger'
HeaderNavMenuContent.displayName = 'Header.NavMenuContent'
HeaderNavMenuItem.displayName = 'Header.NavMenuItem'
HeaderNavMenuLink.displayName = 'Header.NavMenuLink'
HeaderNavMenuIndicator.displayName = 'Header.NavMenuIndicator'

export const Header = {
  Root: HeaderRoot,
  Container: HeaderContainer,
  Branding: HeaderBranding,
  MenuTrigger: HeaderMenuTrigger,
  Backdrop: HeaderBackdrop,
  NavPositioner: HeaderNavPositioner,
  NavContent: HeaderNavContent,
  NavClose: HeaderNavClose,
  NavList: HeaderNavList,
  NavListItem: HeaderNavListItem,
  NavLink: HeaderNavLink,
  Megamenu: HeaderMegamenu,
  MegamenuList: HeaderMegamenuList,
  MegamenuItem: HeaderMegamenuItem,
  NavMenu: HeaderNavMenu,
  NavMenuTrigger: HeaderNavMenuTrigger,
  NavMenuContent: HeaderNavMenuContent,
  NavMenuItem: HeaderNavMenuItem,
  NavMenuLink: HeaderNavMenuLink,
  NavMenuIndicator: HeaderNavMenuIndicator,
}
