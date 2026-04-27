import { dataAttr } from '@zag-js/dom-query'
import * as React from 'react'
import { useFieldContext } from '../field/field'
import { parts } from '../select/select.anatomy'

export interface ElementIds {
  root?: string | undefined
  control?: string | undefined
  icon?: string | undefined
}

export interface UseSelectProps {
  id?: string | undefined
  ids?: ElementIds | undefined
  disabled?: boolean | undefined
  invalid?: boolean | undefined
  readOnly?: boolean | undefined
  required?: boolean | undefined
  name?: string | undefined
  value?: string | undefined
  defaultValue?: string | undefined
  onValueChange?: (value: string) => void
}

export type UseSelectReturn = ReturnType<typeof useSelect>

export function useSelect(props: UseSelectProps = {}) {
  const field = useFieldContext()

  const { ids, disabled = field?.disabled, invalid = field?.invalid, readOnly = field?.readOnly, required = field?.required, name, onValueChange } = props

  const [uncontrolledValue, setUncontrolledValue] = React.useState(props.defaultValue ?? '')
  const isControlled = props.value !== undefined
  const value = isControlled ? props.value! : uncontrolledValue

  const setValue = React.useCallback((newValue: string) => {
    if (!isControlled) {
      setUncontrolledValue(newValue)
    }
    onValueChange?.(newValue)
  }, [isControlled, onValueChange])
  const uid = React.useId()
  const id = props.id ?? uid

  const rootRef = React.useRef<HTMLDivElement>(null)

  const rootId = ids?.root ?? `select::${id}`
  const fieldId = field?.ids.control ?? `select::${id}::select`
  const iconId = ids?.icon ?? `select::${id}::icon`

  const getRootProps = React.useMemo(
    () => () =>
      ({
        ...parts.root.attrs,
        'id': rootId,
        'ref': rootRef,
        'data-disabled': dataAttr(disabled),
        'data-invalid': dataAttr(invalid),
        // 'data-read-only': dataAttr(readOnly),
        // 'data-required': dataAttr(required),
      } as React.HTMLAttributes<HTMLDivElement>),
    [disabled, invalid],
  )

  const getFieldProps = React.useMemo(
    () => () =>
      ({
        'id': fieldId,
        'value': isControlled ? value : undefined,
        'defaultValue': !isControlled ? props.defaultValue : undefined,
        disabled,
        readOnly,
        required,
        'name': name || id,
        'data-invalid': dataAttr(invalid),
        'data-disabled': dataAttr(disabled),
        onChange(e: React.ChangeEvent<HTMLSelectElement>) {
          setValue(e.target.value)
        },
      } as React.SelectHTMLAttributes<HTMLSelectElement>),
    [required, readOnly, id, disabled, invalid, value, isControlled, setValue, props.defaultValue],
  )

  const getIconProps = React.useMemo(
    () => () =>
      ({
        ...parts.icon.attrs,
        'id': iconId,
        'aria-hidden': true,
        'data-disabled': dataAttr(disabled),
        'data-invalid': dataAttr(invalid),
      } as React.HTMLAttributes<HTMLDivElement>),
    [disabled, invalid, iconId],
  )

  return {
    id,
    ids: {
      // label: ids?.label,
      control: ids?.control,
    },
    disabled,
    readOnly,
    invalid,
    required,
    getRootProps,
    getFieldProps,
    getIconProps,
    // dir,
    // getRootNode,
    // ...props,
  }
}
