import { dataAttr } from '@zag-js/dom-query'
import * as React from 'react'
import { useFieldContext } from '../field/field'
import { parts } from './checkbox.anatomy'

export interface ElementIds {
  root?: string | undefined
  input?: string | undefined
  control?: string | undefined
  label?: string | undefined
}

export interface UseCheckboxProps {
  id?: string | undefined
  ids?: ElementIds | undefined
  disabled?: boolean | undefined
  invalid?: boolean | undefined
}

export type UseCheckboxReturn = ReturnType<typeof useCheckbox>

export function useCheckbox(props: UseCheckboxProps = {}) {
  const field = useFieldContext()

  const {
    id = React.useId(),
    ids,
    disabled = field?.disabled ?? false,
    invalid = field?.invalid ?? false,
  } = props

  const rootRef = React.useRef<HTMLDivElement>(null)

  const rootId = ids?.root ?? `checkbox::${id}`
  const labelId = field?.ids.label ?? ids?.label ?? `checkbox::${id}::label`
  const inputId = field?.ids.control ?? ids?.input ?? `checkbox::${id}::input`
  const controlId = ids?.control ?? `checkbox::${id}::control`

  const getRootProps = React.useMemo(
    () => () =>
      ({
        ...parts.root.attrs,
        id: rootId,
        ref: rootRef,
        htmlFor: inputId,
      }) as React.LabelHTMLAttributes<HTMLLabelElement>,
    [id, inputId, rootId, rootRef],
  )

  const getLabelProps = React.useMemo(
    () => () =>
      ({
        ...parts.label.attrs,
        id: labelId,
      }) as React.HTMLAttributes<HTMLDivElement>,
    [disabled, inputId, labelId],
  )

  const getInputProps = React.useMemo(
    () => () =>
      ({
        ...parts.input.attrs,
        'id': inputId,
        'type': 'checkbox',
        disabled,
        'aria-labelledby': labelId,
        'data-invalid': dataAttr(invalid),
        'data-disabled': dataAttr(disabled),
      }) as React.InputHTMLAttributes<HTMLInputElement>,
    [disabled, invalid, inputId, labelId],
  )

  const getControlProps = React.useMemo(
    () => () =>
      ({
        ...parts.control.attrs,
        id: controlId,
        disabled,
      }) as React.HTMLAttributes<HTMLDivElement>,
    [disabled, controlId],
  )

  return {
    ids: {
      label: labelId,
      input: inputId,
      control: controlId,
    },
    refs: {
      rootRef,
    },
    getRootProps,
    getLabelProps,
    getInputProps,
    getControlProps,
    disabled,
    invalid,
  }
}
