import * as React from 'react'
import { cn } from '../tv.config'

export type ProcessListRootProps = React.ComponentPropsWithoutRef<'ol'>

const ProcessListRoot = React.forwardRef<HTMLOListElement, ProcessListRootProps>(
  ({ className, ...props }, forwardedRef) => {
    return (
      <ol
        {...props}
        className={cn('pt-1.5 pl-4 [counter-reset:usa-process-list]', className)}
        ref={forwardedRef}
      />
    )
  },
)

export type ProcessListItemProps = React.ComponentPropsWithoutRef<'li'>

const ProcessListItem = React.forwardRef<HTMLLIElement, ProcessListItemProps>(
  ({ className, ...props }, forwardedRef) => {
    return (
      <li
        {...props}
        className={cn(
          'relative pl-8 pb-8',
          'before:flex before:items-center before:justify-center before:border-4 before:border-gray-90 before:color-gray-90 before:size-10 before:rounded-full before:-left-6 before:-top-1.5 before:absolute before:bg-white before:outline-4 before:outline-offset-0 before:outline-white border-l-8 border-l-blue-10 before:[counter-increment:usa-process-list] before:content-[counter(usa-process-list)] before:font-bold before:text-xl',
          'last:border-l-transparent last:pb-0',
          className,
        )}
        ref={forwardedRef}
      />
    )
  },
)

export type ProcessListContentProps = React.ComponentPropsWithoutRef<'div'>

const ProcessListContent = React.forwardRef<HTMLDivElement, ProcessListContentProps>(
  ({ className, ...props }, forwardedRef) => {
    return (
      <div
        {...props}
        className={cn('relative -top-0.5', className)}
        ref={forwardedRef}
      />
    )
  },
)

export type ProcessListTitleProps = React.ComponentPropsWithoutRef<'div'>

const ProcessListTitle = React.forwardRef<HTMLDivElement, ProcessListTitleProps>(
  ({ className, ...props }, forwardedRef) => {
    return (
      <div
        {...props}
        className={cn('text-xl font-bold', className)}
        ref={forwardedRef}
      />
    )
  },
)

export type ProcessListDescriptionProps = React.ComponentPropsWithoutRef<'div'>

const ProcessListDescription = React.forwardRef<HTMLDivElement, ProcessListDescriptionProps>(
  ({ className, ...props }, forwardedRef) => {
    return (
      <div
        {...props}
        className={cn(className)}
        ref={forwardedRef}
      />
    )
  },
)

ProcessListRoot.displayName = 'ProcessList.Root'
ProcessListItem.displayName = 'ProcessList.Item'
ProcessListContent.displayName = 'ProcessList.Content'
ProcessListTitle.displayName = 'ProcessList.Title'
ProcessListDescription.displayName = 'ProcessList.Description'

export const ProcessList = {
  Root: ProcessListRoot,
  Item: ProcessListItem,
  Content: ProcessListContent,
  Title: ProcessListTitle,
  Description: ProcessListDescription,
}
