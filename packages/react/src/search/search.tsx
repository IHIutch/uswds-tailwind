import type { VariantProps } from 'cva'
import type { UseSearchReturn } from './use-search'
import { mergeProps } from '@zag-js/react'
import * as React from 'react'
import { Button } from '../button'
import { cva, cx } from '../cva.config'
import { Input } from '../input'
import { useSearch } from './use-search'

const searchInputVariants = cva({
  base: 'w-full',
  variants: {
    size: {
      default: 'h-8 text-sm',
      sm: 'h-8 text-sm',
      lg: 'h-12 text-lg',
    },
  },
  defaultVariants: {
    size: 'default',
  },
})

interface SearchContextProps extends UseSearchReturn {
  size?: VariantProps<typeof searchInputVariants>['size']
}

const SearchContext = React.createContext<SearchContextProps | null>(null)

function useSearchContext() {
  const context = React.useContext(SearchContext)
  if (!context) {
    throw new Error('Search components must be used within a Search.Root')
  }
  return context
}

export type SearchRootProps = React.HTMLAttributes<HTMLDivElement> & {
  size?: SearchContextProps['size']
  id?: string
  disabled?: boolean
  required?: boolean
  name?: string
}

function SearchRoot({ size, className, id, disabled, required, name, ...props }: SearchRootProps) {
  const search = useSearch({ id, disabled, required, name })
  const mergedProps = mergeProps(search.getRootProps(), props)

  return (
    <SearchContext.Provider value={{ ...search, size }}>
      <div
        {...mergedProps}
        className={cx('flex', className)}
      />
    </SearchContext.Provider>
  )
}

export type SearchLabelProps = React.LabelHTMLAttributes<HTMLLabelElement>

function SearchLabel({ className, children, ...props }: SearchLabelProps) {
  const { getLabelProps } = useSearchContext()
  const mergedProps = mergeProps(getLabelProps(), props)

  return (
    <label
      {...mergedProps}
      className={cx('sr-only', className)}
    >
      {children}
    </label>
  )
}

export type SearchInputProps = React.InputHTMLAttributes<HTMLInputElement>

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, ...props }, forwardedRef) => {
    const { size, getInputProps } = useSearchContext()
    const mergedProps = mergeProps(getInputProps(), props)

    return (
      <Input
        {...mergedProps}
        className={cx(
          searchInputVariants({ size }),
          className,
        )}
        ref={forwardedRef}
      />
    )
  },
)

const searchButtonVariants = cva({
  base: 'rounded-none rounded-r-sm',
  variants: {
    size: {
      default: 'h-8 text-sm',
      sm: 'h-8 text-sm px-3',
      lg: 'h-12 text-xl px-8',
    },
  },
  defaultVariants: {
    size: 'default',
  },
})

export type SearchButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>

const SearchButton = React.forwardRef<HTMLButtonElement, SearchButtonProps>(
  ({ className, children, ...props }, forwardedRef) => {
    const { size, getButtonProps } = useSearchContext()
    const mergedProps = mergeProps(getButtonProps(), props)

    return (
      <Button
        {...mergedProps}
        className={cx(
          searchButtonVariants({ size }),
          className,
        )}
        ref={forwardedRef}
      >
        {children ?? <span className="icon-[material-symbols--search] size-5 align-middle" aria-hidden="true" />}
      </Button>
    )
  },
)

SearchRoot.displayName = 'Search.Root'
SearchLabel.displayName = 'Search.Label'
SearchInput.displayName = 'Search.Input'
SearchButton.displayName = 'Search.Button'

export const Search = {
  Root: SearchRoot,
  Label: SearchLabel,
  Input: SearchInput,
  Button: SearchButton,
}
