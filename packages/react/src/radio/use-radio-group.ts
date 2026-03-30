import { dataAttr } from '@zag-js/dom-query'
import * as React from 'react'
import { useFieldContext } from '../field/field'
import { useFieldsetContext } from '../fieldset/fieldset'
import { parts } from './radio.anatomy'

export interface ElementIds {
  root?: string | undefined
  input?: string | undefined
  control?: string | undefined
  label?: string | undefined
  legend?: string | undefined
}

export interface UseRadioGroupProps {
  id?: string | undefined
  ids?: ElementIds | undefined
  defaultValue?: string | undefined
  value?: string | undefined
  onValueChange?: ((value: string) => void) | undefined
  disabled?: boolean | undefined
  readOnly?: boolean | undefined
  invalid?: boolean | undefined
  name?: string | undefined
}

export interface GroupItemProps {
  value: string
  disabled?: boolean | undefined
  invalid?: boolean | undefined
}

export type UseRadioGroupReturn = ReturnType<typeof useRadioGroup>

export function useRadioGroup(props: UseRadioGroupProps = {}) {
  const field = useFieldContext()
  const fieldset = useFieldsetContext()
  const { ids, disabled = field?.disabled ?? false, readOnly = false, invalid = field?.invalid ?? false, name } = props

  const uid = React.useId()
  const id = props.id ?? uid
  const rootRef = React.useRef<HTMLDivElement>(null)

  const rootId = ids?.root ?? `radio::${id}`
  const labelId = field?.ids.label ?? ids?.label ?? `radio::${id}::label`
  const legendId = fieldset?.ids.legend ?? `radio::${id}::legend`
  const inputId = field?.ids.control ?? ids?.input ?? `radio::${id}::input`
  const controlId = ids?.control ?? `radio::${id}::control`

  const getRootProps = React.useMemo(
    () => () =>
      ({
        ...parts.root.attrs,
        'id': rootId,
        'ref': rootRef,
        'role': 'radiogroup',
        'aria-labelledby': legendId,
        'aria-disabled': disabled,
        'aria-readonly': readOnly,
      }) as React.HTMLAttributes<HTMLDivElement>,
    [id, rootId, legendId, rootRef],
  )

  const getItemProps = React.useMemo(
    () => (itemProps: GroupItemProps) =>
      ({
        ...parts.root.attrs,
        id: rootId,
        ref: rootRef,
        htmlFor: `${inputId}::${itemProps.value}`,
      }) as React.LabelHTMLAttributes<HTMLLabelElement>,
    [id, inputId, rootId, rootRef],
  )

  const getLabelProps = React.useMemo(
    () => (itemProps: GroupItemProps) =>
      ({
        ...parts.label.attrs,
        id: `${labelId}::${itemProps.value}`,
      }) as React.HTMLAttributes<HTMLDivElement>,
    [disabled, inputId, labelId],
  )

  const getInputProps = React.useMemo(
    () => (itemProps: GroupItemProps) =>
      ({
        ...parts.input.attrs,
        'id': `${inputId}::${itemProps.value}`,
        'type': 'radio',
        'name': name || id,
        'disabled': disabled || itemProps.disabled,
        'aria-labelledby': labelId,
        'data-invalid': dataAttr(invalid),
        'data-disabled': dataAttr(disabled),
      }) as React.InputHTMLAttributes<HTMLInputElement>,
    [disabled, invalid, inputId, labelId],
  )

  const getControlProps = React.useMemo(
    () => (itemProps: GroupItemProps) =>
      ({
        ...parts.control.attrs,
        id: `${controlId}::${itemProps.value}`,
      }) as React.HTMLAttributes<HTMLDivElement>,
    [disabled, controlId],
  )

  return {
    ids: {
      control: controlId,
      input: inputId,
      legend: legendId,
      label: labelId,
    },
    refs: {
      rootRef,
    },
    getRootProps,
    getItemProps,
    getLabelProps,
    getInputProps,
    getControlProps,
    disabled,
    readOnly,
    invalid,
  }
}
