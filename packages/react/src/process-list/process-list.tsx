import * as React from 'react'
import { cx } from '../cva.config'

export type ProcessListRootProps = React.ComponentPropsWithoutRef<'ol'>

function ProcessListRoot({ className, ...props }: ProcessListRootProps) {
  return (
    <ol
      {...props}
      className={cx('pt-1.5 pl-4 [counter-reset:usa-process-list]', className)}
    />
  )
}

export type ProcessListItemProps = React.ComponentPropsWithoutRef<'li'>

function ProcessListItem({ className, ...props }: ProcessListItemProps) {
  return (
    <li
      {...props}
      className={cx(
        'relative pl-8 pb-8',
        'before:flex before:items-center before:justify-center before:border-4 before:border-gray-90 before:color-gray-90 before:size-10 before:rounded-full before:-left-6 before:-top-1.5 before:absolute before:bg-white before:outline-4 before:outline-offset-0 before:outline-white border-l-8 border-l-blue-10 before:[counter-increment:usa-process-list] before:content-[counter(usa-process-list)] before:font-bold before:text-xl',
        'last:border-l-transparent last:pb-0',
        className,
      )}
    />
  )
}

export type ProcessListContentProps = React.ComponentPropsWithoutRef<'div'>

function ProcessListContent({ className, ...props }: ProcessListContentProps) {
  return (
    <div
      {...props}
      className={cx('relative -top-0.5', className)}
    />
  )
}

export type ProcessListTitleProps = React.ComponentPropsWithoutRef<'div'>

function ProcessListTitle({ className, ...props }: ProcessListTitleProps) {
  return (
    <div
      {...props}
      className={cx('text-xl font-bold', className)}
    />
  )
}

export type ProcessListDescriptionProps = React.ComponentPropsWithoutRef<'div'>

function ProcessListDescription({ className, ...props }: ProcessListDescriptionProps) {
  return (
    <div
      {...props}
      className={cx(className)}
    />
  )
}

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
