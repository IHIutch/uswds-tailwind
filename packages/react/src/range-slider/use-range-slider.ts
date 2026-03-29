import { dataAttr } from '@zag-js/dom-query'
import * as React from 'react'
import { useFieldContext } from '../field/field'
import { parts } from './range-slider.anatomy'

export interface UseRangeSliderProps {
  id?: string
  disabled?: boolean
  invalid?: boolean
  name?: string
}

export type UseRangeSliderReturn = ReturnType<typeof useRangeSlider>

export function useRangeSlider(props: UseRangeSliderProps = {}) {
  const field = useFieldContext()

  const { disabled = field?.disabled, invalid = field?.invalid ?? false, name } = props
  const uid = React.useId()
  const id = props.id ?? uid

  const inputId = field?.ids.control ?? `range-slider::${id}::input`

  const getRootProps = React.useMemo(
    () => () =>
      ({
        ...parts.root.attrs,
        'data-disabled': dataAttr(disabled),
      }) as React.HTMLAttributes<HTMLDivElement>,
    [disabled],
  )

  const getInputProps = React.useMemo(
    () => () =>
      ({
        ...parts.input.attrs,
        'id': inputId,
        disabled,
        'name': name || id,
        'data-disabled': dataAttr(disabled),
        'data-invalid': dataAttr(invalid),
      }) as React.InputHTMLAttributes<HTMLInputElement>,
    [disabled, invalid, inputId, name, id],
  )

  return {
    id,
    disabled,
    invalid,
    getRootProps,
    getInputProps,
  }
}
