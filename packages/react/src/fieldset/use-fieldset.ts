// This code is derived from https://github.com/chakra-ui/ark/blob/main/packages/react/src/components/fieldset/use-fieldset.ts
import { getDocument } from '@zag-js/dom-query'
import * as React from 'react'
import { parts } from './fieldset.anatomy'

export interface ElementIds {
  root?: string | undefined
  legend?: string | undefined
  errorText?: string | undefined
  description?: string | undefined
}

export interface UseFieldsetProps {
  /**
   * The id of the field.
   */
  id?: string | undefined
  /**
   * The ids of the field parts.
   */
  disabled?: boolean | undefined
  /**
   * Indicates whether the field is invalid.
   */
  invalid?: boolean | undefined
}

export type UseFieldsetReturn = ReturnType<typeof useFieldset>

export function useFieldset(props: UseFieldsetProps = {}) {
  const { disabled = false, invalid = false } = props

  const [hasErrorText, setHasErrorText] = React.useState(false)
  const [hasDescription, setHasDescription] = React.useState(false)

  const uid = React.useId()
  const id = props.id ?? uid
  const rootRef = React.useRef<HTMLFieldSetElement>(null)

  const legendId = `fieldset::${id}::legend`
  const errorTextId = `fieldset::${id}::error-text`
  const descriptionId = `fieldset::${id}::description`

  React.useLayoutEffect(() => {
    const rootNode = rootRef.current
    if (!rootNode)
      return

    const checkTextElements = () => {
      const doc = getDocument(rootNode)
      setHasErrorText(Boolean(doc.getElementById(errorTextId)))
      setHasDescription(Boolean(doc.getElementById(descriptionId)))
    }
    checkTextElements()

    const observer = new MutationObserver(checkTextElements)
    observer.observe(rootNode, { childList: true, subtree: true })

    return () => observer.disconnect()
  }, [errorTextId, descriptionId])

  const labelIds = React.useMemo(() => {
    const ids: string[] = []
    if (hasErrorText && invalid)
      ids.push(errorTextId)
    if (hasDescription)
      ids.push(descriptionId)
    return ids.join(' ') || undefined
  }, [invalid, errorTextId, descriptionId, hasErrorText, hasDescription])

  const getRootProps = React.useMemo(
    () => () =>
      ({
        ...parts.root.attrs,
        'ref': rootRef,
        'aria-labelledby': legendId,
        'aria-describedby': labelIds,
      }) as React.HTMLAttributes<HTMLElement>,
    [disabled, invalid],
  )

  const getLegendProps = React.useMemo(
    () => () =>
      ({
        ...parts.legend.attrs,
        id: legendId,
      }) as React.HTMLAttributes<HTMLLegendElement>,
    [disabled, invalid, legendId],
  )

  const getDescriptionProps = React.useMemo(
    () => () =>
      ({
        ...parts.description.attrs,
        id: descriptionId,
      }) as React.HTMLAttributes<HTMLSpanElement>,
    [disabled, descriptionId],
  )

  const getErrorTextProps = React.useMemo(
    () => () =>
      ({
        id: errorTextId,
        ...parts.errorText.attrs,
      }) as React.HTMLAttributes<HTMLSpanElement>,
    [errorTextId],
  )

  return {
    ariaDescribedby: labelIds,
    ids: {
      legend: legendId,
      errorText: errorTextId,
      description: descriptionId,
    },
    refs: {
      rootRef,
    },
    disabled,
    invalid,
    getLegendProps,
    getRootProps,
    getDescriptionProps,
    getErrorTextProps,
  }
}
