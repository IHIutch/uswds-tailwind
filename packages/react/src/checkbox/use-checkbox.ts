import * as React from 'react'
import { parts } from './checkbox.anatomy'

export interface ElementIds {
  root?: string | undefined
  input?: string | undefined
  control?: string | undefined
  label?: string | undefined
}

export interface UseCheckboxProps {
  /**
   * The id of the field.
   */
  id?: string | undefined
  /**
   * The ids of the field parts.
   */
  ids?: ElementIds | undefined
  /**
   * Indicates whether the field is disabled.
   */
  disabled?: boolean | undefined
}

export type UseCheckboxReturn = ReturnType<typeof useCheckbox>

export function useCheckbox(props: UseCheckboxProps = {}) {
  const { ids, disabled = false } = props

  const uid = React.useId()
  const id = props.id ?? uid
  const rootRef = React.useRef<HTMLDivElement>(null)

  const rootId = ids?.root ?? `checkbox::${id}`
  const labelId = ids?.label ?? `checkbox::${id}::label`
  const inputId = ids?.input ?? `checkbox::${id}::input`
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
      }) as React.InputHTMLAttributes<HTMLInputElement>,
    [disabled, inputId, labelId],
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
  }
}
