import { dataAttr } from '@zag-js/dom-query'
import * as React from 'react'
import { useFieldContext } from '../field/field'
import { parts } from './search.anatomy'

export interface UseSearchProps {
  id?: string
  disabled?: boolean
  required?: boolean
  name?: string
}

export type UseSearchReturn = ReturnType<typeof useSearch>

export function useSearch(props: UseSearchProps = {}) {
  const field = useFieldContext()

  const { disabled = field?.disabled, required = field?.required, name } = props
  const uid = React.useId()
  const id = props.id ?? uid

  const inputId = field?.ids.control ?? `search::${id}::input`
  const labelId = field?.ids.label ?? `search::${id}::label`
  const buttonId = `search::${id}::button`

  const getRootProps = React.useMemo(
    () => () =>
      ({
        ...parts.root.attrs,
        'data-disabled': dataAttr(disabled),
      }) as React.HTMLAttributes<HTMLDivElement>,
    [disabled],
  )

  const getLabelProps = React.useMemo(
    () => () =>
      ({
        ...parts.label.attrs,
        'id': labelId,
        'htmlFor': inputId,
        'data-disabled': dataAttr(disabled),
      }) as React.LabelHTMLAttributes<HTMLLabelElement>,
    [disabled, inputId, labelId],
  )

  const getInputProps = React.useMemo(
    () => () =>
      ({
        ...parts.input.attrs,
        'id': inputId,
        'type': 'search' as const,
        disabled,
        required,
        'name': name || id,
        'data-disabled': dataAttr(disabled),
      }) as React.InputHTMLAttributes<HTMLInputElement>,
    [disabled, required, inputId, name, id],
  )

  const getButtonProps = React.useMemo(
    () => () =>
      ({
        ...parts.button.attrs,
        'id': buttonId,
        'type': 'submit' as const,
        disabled,
        'data-disabled': dataAttr(disabled),
      }) as React.ButtonHTMLAttributes<HTMLButtonElement>,
    [disabled],
  )

  return {
    id,
    disabled,
    required,
    getRootProps,
    getLabelProps,
    getInputProps,
    getButtonProps,
  }
}
