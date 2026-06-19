import type { VariantProps } from '../tv.config'
import type { UseSearchReturn } from './use-search'
import { mergeProps } from '@zag-js/react'
import * as React from 'react'
import { Button } from '../button'
import { Input } from '../input'
import { cn, tv } from '../tv.config'
import { useSearch } from './use-search'

const searchVariants = tv({
  slots: {
    input: 'w-full',
    button: 'rounded-none rounded-r-sm',
  },
  variants: {
    size: {
      default: {
        input: 'h-8 text-sm',
        button: 'h-8 text-sm',
      },
      sm: {
        input: 'h-8 text-sm',
        button: 'h-8 text-sm px-3',
      },
      lg: {
        input: 'h-12 text-lg',
        button: 'h-12 text-xl px-8',
      },
    },
  },
  defaultVariants: {
    size: 'default',
  },
})

interface SearchContextProps extends UseSearchReturn {
  size?: VariantProps<typeof searchVariants>['size']
}

const SearchContext = React.createContext<SearchContextProps | null>(null)

function useSearchContext() {
  const context = React.useContext(SearchContext)
  if (!context) {
    throw new Error('Search components must be used within a Search.Root')
  }
  return context
}

export type SearchRootProps = React.ComponentPropsWithoutRef<'div'> & {
  size?: SearchContextProps['size']
  id?: string
  disabled?: boolean
  required?: boolean
  name?: string
}

const SearchRoot = React.forwardRef<HTMLDivElement, SearchRootProps>(
  ({ size, className, id, disabled, required, name, ...props }, forwardedRef) => {
    const search = useSearch({ id, disabled, required, name })
    const mergedProps = mergeProps(search.getRootProps(), props)

    return (
      <SearchContext.Provider value={{ ...search, size }}>
        <div
          {...mergedProps}
          className={cn('flex', className)}
          ref={forwardedRef}
        />
      </SearchContext.Provider>
    )
  },
)

export type SearchLabelProps = React.ComponentPropsWithoutRef<'label'>

function SearchLabel({ className, children, ...props }: SearchLabelProps) {
  const { getLabelProps } = useSearchContext()
  const mergedProps = mergeProps(getLabelProps(), props)

  return (
    <label
      {...mergedProps}
      className={cn('sr-only', className)}
    >
      {children}
    </label>
  )
}

export type SearchInputProps = React.ComponentPropsWithoutRef<'input'>

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, ...props }, forwardedRef) => {
    const { size, getInputProps } = useSearchContext()
    const mergedProps = mergeProps(getInputProps(), props)
    const { input } = searchVariants({ size })

    return (
      <Input
        {...mergedProps}
        className={input({ className })}
        ref={forwardedRef}
      />
    )
  },
)

export type SearchButtonProps = React.ComponentPropsWithoutRef<'button'>

const SearchButton = React.forwardRef<HTMLButtonElement, SearchButtonProps>(
  ({ className, children, ...props }, forwardedRef) => {
    const { size, getButtonProps } = useSearchContext()
    const mergedProps = mergeProps(getButtonProps(), props)
    const { button } = searchVariants({ size })

    return (
      <Button
        {...mergedProps}
        className={button({ className })}
        ref={forwardedRef}
      >
        {children ?? <span className="icon-[material-symbols--search] size-6" aria-hidden="true" />}
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
