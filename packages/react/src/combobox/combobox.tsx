import * as combobox from '@uswds-tailwind/combobox-compat'
import { mergeProps, normalizeProps, useMachine } from '@zag-js/react'
import * as React from 'react'
import { cx } from '../cva.config'
import { useFieldContext } from '../field/field'

export interface ComboboxContextProps {
  api: combobox.Api
}

const ComboboxContext = React.createContext<ComboboxContextProps | null>(null)

function useComboboxContext() {
  const context = React.useContext(ComboboxContext)
  if (!context) {
    throw new Error('Combobox components must be used within a Combobox.Root')
  }
  return context
}

const ComboboxRoot = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & Omit<combobox.Props, 'id'>>(
  ({ className, ...props }, forwardedRef) => {
    const field = useFieldContext()

    const service = useMachine(combobox.machine, {
      id: React.useId(),
      ids: {
        label: field?.ids.label,
        input: field?.ids.control,
      },
      disabled: props.disabled ?? field?.disabled,
      ...props,
    })

    const api = combobox.connect(service, normalizeProps)
    const mergedProps = mergeProps(api.getRootProps(), props)

    return (
      <ComboboxContext.Provider value={{ api }}>
        <div {...mergedProps} className={cx('relative mt-2', className)} ref={forwardedRef} />
      </ComboboxContext.Provider>
    )
  },
)

const ComboboxLabel = React.forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(
  ({ className, ...props }, forwardedRef) => {
    const { api } = useComboboxContext()
    const mergedProps = mergeProps(api.getLabelProps(), props)

    return <label {...mergedProps} className={cx('block', className)} ref={forwardedRef} />
  },
)

const ComboboxInput = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, forwardedRef) => {
    const { api } = useComboboxContext()
    const field = useFieldContext()
    const mergedProps = mergeProps(api.getInputProps(), field?.getInputProps(), props)

    return <input {...mergedProps} className={cx('pr-10 p-2 bg-white w-full h-10 border border-gray-60 focus:outline-offset-0 focus:outline-4 focus:outline-blue-40v invalid:ring-4 invalid:ring-red-60v invalid:border-transparent invalid:outline-offset-4', className)} ref={forwardedRef} />
  },
)

export interface ComboboxListProps extends Omit<React.HTMLAttributes<HTMLUListElement>, 'children'> {
  children?: React.ReactNode | (({ options }: { options: ComboboxContextProps['api']['filteredOptions'] }) => React.ReactNode)
}

const ComboboxList = React.forwardRef<HTMLUListElement, ComboboxListProps>(
  ({ className, children, ...props }, forwardedRef) => {
    const { api } = useComboboxContext()
    const mergedProps = mergeProps(api.getListProps(), props)

    const content = typeof children === 'function' ? children({ options: api.filteredOptions }) : children

    return (
      <ul {...mergedProps} className={cx('absolute border border-t-0 border-gray-60 bg-white max-h-52 overflow-y-scroll w-full z-10', className)} ref={forwardedRef}>
        {content}
      </ul>
    )
  },
)

export type ComboboxItemProps = React.LiHTMLAttributes<HTMLLIElement>
  & combobox.ComboboxOption
  & { index: number }

const ComboboxItem = React.forwardRef<HTMLLIElement, ComboboxItemProps>(
  ({ value, label, index, children, ...props }, forwardedRef) => {
    const { api } = useComboboxContext()
    const mergedProps = mergeProps(api.getItemProps({ value, label }, index), props)

    return (
      <li {...mergedProps} className={cx('p-2 cursor-pointer aria-selected:bg-blue-60v aria-selected:text-white not-focus:data-active:-outline-offset-2 not-focus:data-active:outline-2 not-focus:data-active:outline-black focus:outline-4 focus:outline-blue-40v focus:-outline-offset-4', props.className)} ref={forwardedRef}>
        {children}
      </li>
    )
  },
)

const ComboboxEmptyItem = React.forwardRef<HTMLLIElement, React.HTMLAttributes<HTMLLIElement>>(
  ({ children, ...props }, forwardedRef) => {
    const { api } = useComboboxContext()
    const mergedProps = mergeProps(api.getEmptyItemProps(), props)

    return (
      <li {...mergedProps} className={cx('p-2 cursor-not-allowed hidden data-empty:block', mergedProps.className)} ref={forwardedRef}>
        {children || 'No results found'}
      </li>
    )
  },
)

const ComboboxIndicatorGroup = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, forwardedRef) => {
    return (
      <div {...props} className={cx('absolute z-10 inset-y-0 right-0 flex', className)} ref={forwardedRef} />
    )
  },
)

const ComboboxControl = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, forwardedRef) => {
    return (
      <div {...props} className={cx('relative', className)} ref={forwardedRef} />
    )
  },
)

const ComboboxClearButton = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, children, ...props }, forwardedRef) => {
    const { api } = useComboboxContext()
    const mergedProps = mergeProps(api.getClearButtonProps(), props)

    return (
      <button {...mergedProps} className={cx('h-full px-1 flex items-center focus:-outline-offset-4 focus:outline-4 focus:outline-blue-40v/60 bg-transparent text-gray-50', className)} ref={forwardedRef}>
        {children || (
          <div className="icon-[material-symbols--close] size-6"></div>
        )}
      </button>
    )
  },
)

const ComboboxToggleButton = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, children, ...props }, forwardedRef) => {
    const { api } = useComboboxContext()
    const mergedProps = mergeProps(api.getToggleButtonProps(), props)

    return (
      <button {...mergedProps} className={cx('h-full px-1 flex items-center focus:-outline-offset-4 focus:outline-4 focus:outline-blue-40v/60 bg-transparent text-gray-50', className)} ref={forwardedRef}>
        {children || (
          <div className="icon-[material-symbols--expand-more] size-8"></div>
        )}
      </button>
    )
  },
)

export const Combobox = {
  Root: ComboboxRoot,
  Label: ComboboxLabel,
  Control: ComboboxControl,
  Input: ComboboxInput,
  List: ComboboxList,
  Item: ComboboxItem,
  EmptyItem: ComboboxEmptyItem,
  IndicatorGroup: ComboboxIndicatorGroup,
  ClearButton: ComboboxClearButton,
  ToggleButton: ComboboxToggleButton,
}
