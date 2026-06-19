import * as React from 'react'
import { cn } from '../tv.config'

export type CollectionRootProps = React.ComponentPropsWithoutRef<'div'>

const CollectionRoot = React.forwardRef<HTMLDivElement, CollectionRootProps>(
  ({ className, ...props }, forwardedRef) => {
    return <div {...props} className={className} ref={forwardedRef} />
  },
)

export type CollectionListProps = React.ComponentPropsWithoutRef<'ul'>

const CollectionList = React.forwardRef<HTMLUListElement, CollectionListProps>(
  ({ className, ...props }, forwardedRef) => {
    return <ul {...props} className={cn('divide-y *:py-4 *:first:pt-0 *:last:pb-0', className)} ref={forwardedRef} />
  },
)

export type CollectionItemProps = React.ComponentPropsWithoutRef<'li'> & {
  startElement?: React.ReactNode
}

const CollectionItem = React.forwardRef<HTMLLIElement, CollectionItemProps>(
  ({ className, children, startElement, ...props }, forwardedRef) => {
    return (
      <li
        {...props}
        className={cn('flex gap-4', className)}
        ref={forwardedRef}
      >
        {startElement ?? null}
        <div>{children}</div>
      </li>
    )
  },
)

export type CollectionHeadingProps = React.ComponentPropsWithoutRef<'div'>

const CollectionHeading = React.forwardRef<HTMLDivElement, CollectionHeadingProps>(
  ({ className, ...props }, forwardedRef) => {
    return <div {...props} className={cn('text-lg font-bold', className)} ref={forwardedRef} />
  },
)

export type CollectionDescriptionProps = React.ComponentPropsWithoutRef<'div'>

const CollectionDescription = React.forwardRef<HTMLDivElement, CollectionDescriptionProps>(
  ({ className, ...props }, forwardedRef) => {
    return <div {...props} className={cn('mt-1', className)} ref={forwardedRef} />
  },
)

export type CollectionMetaListProps = React.ComponentPropsWithoutRef<'ul'>

const CollectionMetaList = React.forwardRef<HTMLUListElement, CollectionMetaListProps>(
  ({ className, ...props }, forwardedRef) => {
    return <ul {...props} className={cn('mt-2 flex flex-col gap-1', className)} ref={forwardedRef} />
  },
)

export type CollectionMetadataProps = React.ComponentPropsWithoutRef<'li'>

const CollectionMetaListItem = React.forwardRef<HTMLLIElement, CollectionMetadataProps>(
  ({ className, ...props }, forwardedRef) => {
    return <li {...props} className={cn('text-sm leading-tight', className)} ref={forwardedRef} />
  },
)

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

export type CollectionCalendarProps = Omit<React.ComponentPropsWithoutRef<'time'>, 'dateTime'>
  & CollectionCalendarContextProps

const CollectionCalendar = React.forwardRef<HTMLTimeElement, CollectionCalendarProps>(
  ({ className, dateTime, ...props }, forwardedRef) => {
    return (
      <CollectionCalendarContext.Provider
        value={{
          dateTime,
        }}
      >
        {/* Since this component only displays month/date, choose to format dateTime without time */}
        <time {...props} dateTime={dateTime.toISOString().split('T')[0]} className={cn('text-lg w-20 shrink-0', className)} ref={forwardedRef} />
      </CollectionCalendarContext.Provider>
    )
  },
)

export type CollectionCalendarDateProps = React.ComponentPropsWithoutRef<'div'>

const CollectionCalendarDate = React.forwardRef<HTMLDivElement, CollectionCalendarDateProps>(
  ({ className, children, ...props }, forwardedRef) => {
    const { dateTime } = useCollectionCalendarContext()
    return (
      <div {...props} className={cn('font-bold border text-blue-60v border-blue-60v flex items-center justify-center p-2 rounded-b-xs', className)} ref={forwardedRef}>
        {children || dateTime.toLocaleString(undefined, { day: 'numeric' })}
      </div>
    )
  },
)

export type CollectionCalendarMonthProps = React.ComponentPropsWithoutRef<'div'>

const CollectionCalendarMonth = React.forwardRef<HTMLDivElement, CollectionCalendarMonthProps>(
  ({ className, children, ...props }, forwardedRef) => {
    const { dateTime } = useCollectionCalendarContext()
    return (
      <div {...props} className={cn('text-white font-bold bg-blue-60v flex items-center justify-center p-2 rounded-t-xs', className)} ref={forwardedRef}>
        {children || dateTime.toLocaleString(undefined, { month: 'short' })}
      </div>
    )
  },
)

export type CollectionThumbnailProps = React.ComponentPropsWithoutRef<'div'>

const CollectionThumbnail = React.forwardRef<HTMLDivElement, CollectionThumbnailProps>(
  ({ className, ...props }, forwardedRef) => {
    return <div {...props} className={cn('w-20 shrink-0', className)} ref={forwardedRef} />
  },
)

// type CollectionThumbnailImageProps = React.ImgHTMLAttributes<HTMLImageElement>

// function CollectionThumbnailImage({ className, ...props }: CollectionThumbnailImageProps) {
//   return <img {...props} className={cn('w-full h-auto object-cover', className)} />
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
