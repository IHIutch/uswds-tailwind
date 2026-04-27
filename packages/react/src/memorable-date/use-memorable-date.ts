import { dataAttr } from '@zag-js/dom-query'
import * as React from 'react'
import { parts } from './memorable-date.anatomy'

export interface UseMemorableDateProps {
  id?: string
  disabled?: boolean
  invalid?: boolean
}

export type UseMemorableDateReturn = ReturnType<typeof useMemorableDate>

export function useMemorableDate(props: UseMemorableDateProps = {}) {
  const { disabled = false, invalid = false } = props
  const uid = React.useId()
  const id = props.id ?? uid

  const getRootProps = React.useMemo(
    () => () =>
      ({
        ...parts.root.attrs,
        'data-disabled': dataAttr(disabled),
        'data-invalid': dataAttr(invalid),
      }) as React.HTMLAttributes<HTMLFieldSetElement>,
    [disabled, invalid],
  )

  const getLegendProps = React.useMemo(
    () => () =>
      ({
        ...parts.legend.attrs,
      }) as React.HTMLAttributes<HTMLLegendElement>,
    [],
  )

  const getControlProps = React.useMemo(
    () => () =>
      ({
        ...parts.control.attrs,
      }) as React.HTMLAttributes<HTMLDivElement>,
    [],
  )

  return {
    id,
    disabled,
    invalid,
    getRootProps,
    getLegendProps,
    getControlProps,
  }
}
