import * as React from 'react'
import { cx } from '../cva.config'

export type CollectionRootProps = React.HTMLAttributes<HTMLDivElement>

function CollectionRoot({ className, ...props }: CollectionRootProps) {
  return <div {...props} className={cx('', className)} />
}

export type CollectionListProps = React.HTMLAttributes<HTMLUListElement>

function CollectionList({ className, ...props }: CollectionListProps) {
  return <ul {...props} className={cx('divide-y *:py-4 *:first:pt-0 *:last:pb-0', className)} />
}

export type CollectionItemProps = React.HTMLAttributes<HTMLLIElement> & {
  startElement?: React.ReactNode
}

function CollectionItem({ className, children, startElement, ...props }: CollectionItemProps) {
  return (
    <li
      {...props}
      className={cx('flex gap-4', className)}
    >
      {startElement ?? null}
      <div>{children}</div>
    </li>
  )
}

export type CollectionHeadingProps = React.HTMLAttributes<HTMLDivElement>

function CollectionHeading({ className, ...props }: CollectionHeadingProps) {
  return <div {...props} className={cx('text-lg font-bold', className)} />
}

export type CollectionDescriptionProps = React.HTMLAttributes<HTMLDivElement>

function CollectionDescription({ className, ...props }: CollectionDescriptionProps) {
  return <div {...props} className={cx('mt-1', className)} />
}

export type CollectionMetaListProps = React.HTMLAttributes<HTMLUListElement>

function CollectionMetaList({ className, ...props }: CollectionMetaListProps) {
  return <ul {...props} className={cx('mt-2 flex flex-col gap-1', className)} />
}

export type CollectionMetadataProps = React.HTMLAttributes<HTMLLIElement>

function CollectionMetaListItem({ className, ...props }: CollectionMetadataProps) {
  return <li {...props} className={cx('text-sm leading-tight', className)} />
}

export interface CollectionCalendarContextProps {
  dateTime: Date
}

const CollectionCalendarContext = React.createContext<CollectionCalendarContextProps | null>(null)

export function useCollectionCalendarContext() {
  const context = React.useContext(CollectionCalendarContext)
  if (!context) {
    throw new Error('CollectionCalendar components must be used within a CollectionCalendar')
  }
  return context
}

export type CollectionCalendarProps = Omit<React.TimeHTMLAttributes<HTMLTimeElement>, 'dateTime'>
  & CollectionCalendarContextProps

function CollectionCalendar({ className, dateTime, ...props }: CollectionCalendarProps) {
  return (
    <CollectionCalendarContext.Provider
      value={{
        dateTime,
      }}
    >
      {/* Since this component only displays month/date, choose to format dateTime without time */}
      <time {...props} dateTime={dateTime.toISOString().split('T')[0]} className={cx('text-lg w-20 shrink-0', className)} />
    </CollectionCalendarContext.Provider>
  )
}

export type CollectionCalendarDateProps = React.HTMLAttributes<HTMLSpanElement>

function CollectionCalendarDate({ className, children, ...props }: CollectionCalendarDateProps) {
  const { dateTime } = useCollectionCalendarContext()
  return (
    <div {...props} className={cx('font-bold border text-blue-60v border-blue-60v flex items-center justify-center p-2 rounded-b-xs', className)}>
      {children || dateTime.toLocaleString(undefined, { day: 'numeric' })}
    </div>
  )
}

export type CollectionCalendarMonthProps = React.HTMLAttributes<HTMLSpanElement>

function CollectionCalendarMonth({ className, children, ...props }: CollectionCalendarMonthProps) {
  const { dateTime } = useCollectionCalendarContext()
  return (
    <div {...props} className={cx('text-white font-bold bg-blue-60v flex items-center justify-center p-2 rounded-t-xs', className)}>
      {children || dateTime.toLocaleString(undefined, { month: 'short' })}
    </div>
  )
}

export type CollectionThumbnailProps = React.HTMLAttributes<HTMLDivElement>

function CollectionThumbnail({ className, ...props }: CollectionThumbnailProps) {
  return <div {...props} className={cx('w-20 shrink-0', className)} />
}

// type CollectionThumbnailImageProps = React.ImgHTMLAttributes<HTMLImageElement>

// function CollectionThumbnailImage({ className, ...props }: CollectionThumbnailImageProps) {
//   return <img {...props} className={cx('w-full h-auto object-cover', className)} />
// }

CollectionRoot.displayName = 'Collection.Root'
CollectionList.displayName = 'Collection.List'
CollectionItem.displayName = 'Collection.Item'
CollectionHeading.displayName = 'Collection.Heading'
CollectionDescription.displayName = 'Collection.Description'
CollectionMetaList.displayName = 'Collection.MetaList'
CollectionMetaListItem.displayName = 'Collection.MetaListItem'
CollectionCalendar.displayName = 'Collection.Calendar'
CollectionCalendarDate.displayName = 'Collection.CalendarDate'
CollectionCalendarMonth.displayName = 'Collection.CalendarMonth'
CollectionThumbnail.displayName = 'Collection.Thumbnail'

export const Collection = {
  Root: CollectionRoot,
  List: CollectionList,
  Item: CollectionItem,
  Heading: CollectionHeading,
  Description: CollectionDescription,
  MetaList: CollectionMetaList,
  MetaListItem: CollectionMetaListItem,
  Calendar: CollectionCalendar,
  CalendarDate: CollectionCalendarDate,
  CalendarMonth: CollectionCalendarMonth,
  Thumbnail: CollectionThumbnail,
  // ThumbnailImage: CollectionThumbnailImage,
}
