import type * as collapse from '@uswds-tailwind/collapse-compat'
import type { UseBannerProps } from './use-banner'
import { mergeProps } from '@zag-js/react'
import * as React from 'react'
import { cx } from '../cva.config'
import { useBanner } from './use-banner'

// Context

interface BannerContextProps {
  api: collapse.Api
}

const BannerContext = React.createContext<BannerContextProps | null>(null)

function useBannerContext() {
  const context = React.useContext(BannerContext)
  if (!context) {
    throw new Error('Banner components must be used within a Banner.Root')
  }
  return context
}

// Root

export type BannerRootProps = UseBannerProps & React.ComponentPropsWithoutRef<'section'>

const BannerRoot = React.forwardRef<HTMLElement, BannerRootProps>(
  ({ open, defaultOpen, onOpenChange, className, ...props }, forwardedRef) => {
    const api = useBanner({ open, defaultOpen, onOpenChange })
    const mergedProps = mergeProps(api.getRootProps(), props)

    return (
      <BannerContext.Provider value={{ api }}>
        <section
          {...mergedProps}
          aria-label="Official website of the United States government"
          className={cx('@container bg-gray-5 group', className)}
          ref={forwardedRef}
        />
      </BannerContext.Provider>
    )
  },
)

// Header

export type BannerHeaderProps = React.ComponentPropsWithoutRef<'header'>

function BannerHeader({ className, ...props }: BannerHeaderProps) {
  return (
    <header
      {...props}
      className={cx(
        'flex text-xs gap-2 @tablet:items-center pl-4 pr-12 @tablet:pr-4 @tablet:px-8 py-2 @tablet:py-1 mx-auto max-w-5xl min-h-12 @tablet:min-h-0 leading-tight @tablet:leading-none relative',
        className,
      )}
    />
  )
}

// Flag

export type BannerFlagProps = React.ComponentPropsWithoutRef<'div'>

function BannerFlag({ className, children, ...props }: BannerFlagProps) {
  return (
    <div {...props} className={cx('shrink-0 w-4', className)}>
      {children || (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 64 64">
          <path fill="#DB3E1F" d="M32 10h32v4H32zM32 18h32v4H32zM32 26h32v4H32zM32 34h32v4H32zM0 42h64v4H0zM0 50h64v4H0z" />
          <path fill="#fff" d="M32 14h32v4H32zM32 22h32v4H32zM32 30h32v4H32z" />
          <path fill="#fff" d="M32 30h32v4H32zM0 46h64v4H0zM0 38h64v4H0z" />
          <path fill="#fff" d="M0 38h64v4H0z" />
          <path fill="#1D33B1" d="M0 10h32v28H0z" />
          <path fill="#fff" d="M4 14h4v4H4zM8 22h4v4H8zM4 30h4v4H4zM12 14h4v4h-4zM16 22h4v4h-4zM12 30h4v4h-4zM20 14h4v4h-4zM24 22h4v4h-4zM20 30h4v4h-4z" />
        </svg>
      )}
    </div>
  )
}

// HeaderText

export type BannerHeaderTextProps = React.ComponentPropsWithoutRef<'p'>

function BannerHeaderText({ className, ...props }: BannerHeaderTextProps) {
  return (
    <div {...props} className={cx('@tablet:flex @tablet:gap-2 @tablet:items-center', className)} />
  )
}

// Trigger

export type BannerTriggerProps = React.ComponentPropsWithoutRef<'button'>

const BannerTrigger = React.forwardRef<HTMLButtonElement, BannerTriggerProps>(
  ({ className, ...props }, forwardedRef) => {
    const { api } = useBannerContext()
    const mergedProps = mergeProps(api.getTriggerProps(), props)

    return (
      <button
        type="button"
        {...mergedProps}
        className={cx(
          'group text-blue-60v cursor-pointer inline-flex items-center underline @max-tablet:data-[state=open]:text-transparent',
          'focus:outline-0 @tablet:focus:outline-4 @tablet:focus:outline-blue-40v',
          '@max-tablet:after:absolute after:inset-0',
          'focus:after:outline-4 focus:after:-outline-offset-4 focus:after:outline-blue-40v',
          className,
        )}
        ref={forwardedRef}
      />
    )
  },
)

export type BannerIndicatorProps = Omit<React.ComponentPropsWithoutRef<'div'>, 'children'> & {
  children?: React.ReactNode | ((context: BannerContextProps) => React.ReactNode)
}

function BannerIndicator({ className, children, ...props }: BannerIndicatorProps) {
  const content = typeof children === 'function'
    ? children(useBannerContext())
    : children

  return (
    <div
      aria-hidden="true"
      className={
        cx('size-4', className)
      }
      {...props}
    >
      {content || <div className="icon-[material-symbols--expand-more] size-4 group-data-[state=open]:rotate-180" />}
    </div>
  )
}

// CloseButton

export type BannerCloseButtonProps = React.ComponentPropsWithoutRef<'div'>

function BannerCloseButton({ className, children, ...props }: BannerCloseButtonProps) {
  return (
    <div
      {...props}
      aria-hidden="true"
      className={cx(
        'hidden group-data-[state=open]:flex @tablet:group-data-[state=open]:hidden items-center justify-center absolute right-0 top-0 bottom-0 bg-gray-10 size-12 pointer-events-none',
        className,
      )}
    >
      {children || (
        <span className="icon-[material-symbols--close] text-blue-60v size-6" />
      )}
    </div>
  )
}

// Content

export type BannerContentProps = React.ComponentPropsWithoutRef<'div'>

const BannerContent = React.forwardRef<HTMLDivElement, BannerContentProps>(
  ({ className, ...props }, forwardedRef) => {
    const { api } = useBannerContext()
    const mergedProps = mergeProps(api.getContentProps(), props)

    return (
      <div
        {...mergedProps}
        className={cx(
          'py-6 px-3 grid @tablet:grid-cols-2 gap-6 mx-auto max-w-5xl not-data-[state=open]:hidden',
          className,
        )}
        ref={forwardedRef}
      />
    )
  },
)

// Guidance

export type BannerGuidanceProps = React.ComponentPropsWithoutRef<'div'>

function BannerGuidance({ className, ...props }: BannerGuidanceProps) {
  return (
    <div
      {...props}
      className={cx('flex gap-2', className)}
    />
  )
}

// GuidanceIcon

export type BannerGuidanceIconProps = React.ComponentPropsWithoutRef<'div'>

function BannerGuidanceIcon({ className, ...props }: BannerGuidanceIconProps) {
  return (
    <div
      aria-hidden="true"
      {...props}
      className={cx('rounded-full border size-10 shrink-0 justify-center items-center flex', className)}
    />
  )
}

// GuidanceTitle

export type BannerGuidanceContentProps = React.ComponentPropsWithoutRef<'p'>

function BannerGuidanceContent({ className, ...props }: BannerGuidanceContentProps) {
  return (
    <div {...props} className={cx('', className)} />
  )
}

// GuidanceTitle

export type BannerGuidanceTitleProps = React.ComponentPropsWithoutRef<'p'>

function BannerGuidanceTitle({ className, ...props }: BannerGuidanceTitleProps) {
  return (
    <div {...props} className={cx('font-bold', className)} />
  )
}

// GuidanceBody

export type BannerGuidanceBodyProps = React.ComponentPropsWithoutRef<'p'>

function BannerGuidanceBody({ className, ...props }: BannerGuidanceBodyProps) {
  return (
    <div {...props} className={cx(className)} />
  )
}

// Display names

BannerRoot.displayName = 'Banner.Root'
BannerHeader.displayName = 'Banner.Header'
BannerFlag.displayName = 'Banner.Flag'
BannerHeaderText.displayName = 'Banner.HeaderText'
BannerTrigger.displayName = 'Banner.Trigger'
BannerIndicator.displayName = 'Banner.Indicator'
BannerCloseButton.displayName = 'Banner.CloseButton'
BannerContent.displayName = 'Banner.Content'
BannerGuidance.displayName = 'Banner.Guidance'
BannerGuidanceIcon.displayName = 'Banner.GuidanceIcon'
BannerGuidanceContent.displayName = 'Banner.GuidanceContent'
BannerGuidanceTitle.displayName = 'Banner.GuidanceTitle'
BannerGuidanceBody.displayName = 'Banner.GuidanceBody'

export const Banner = {
  Root: BannerRoot,
  Header: BannerHeader,
  Flag: BannerFlag,
  HeaderText: BannerHeaderText,
  Trigger: BannerTrigger,
  Indicator: BannerIndicator,
  CloseButton: BannerCloseButton,
  Content: BannerContent,
  Guidance: BannerGuidance,
  GuidanceIcon: BannerGuidanceIcon,
  GuidanceContent: BannerGuidanceContent,
  GuidanceTitle: BannerGuidanceTitle,
  GuidanceBody: BannerGuidanceBody,
}
