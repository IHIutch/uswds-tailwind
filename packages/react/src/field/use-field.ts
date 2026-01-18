// This code is derived from https://github.com/chakra-ui/ark/blob/main/packages/react/src/components/field/use-field.ts

import { ariaAttr, getDocument } from '@zag-js/dom-query'
import * as React from 'react'
import { useFieldsetContext } from '../fieldset/fieldset'
import { parts } from './field.anatomy'

export interface ElementIds {
  root?: string | undefined
  control?: string | undefined
  label?: string | undefined
  errorText?: string | undefined
  description?: string | undefined
}

export interface UseFieldProps {
  /**
   * The id of the field.
   */
  id?: string | undefined
  /**
   * The ids of the field parts.
   */
  ids?: ElementIds | undefined
  /**
   * Indicates whether the field is required.
   */
  required?: boolean | undefined
  /**
   * Indicates whether the field is disabled.
   */
  disabled?: boolean | undefined
  /**
   * Indicates whether the field is invalid.
   */
  invalid?: boolean | undefined
  /**
   * Indicates whether the field is read-only.
   */
  readOnly?: boolean | undefined
}

export type UseFieldReturn = ReturnType<typeof useField>

export function useField(props: UseFieldProps = {}) {
  const fieldset = useFieldsetContext()

  const { ids, disabled = Boolean(fieldset?.disabled), invalid = false, readOnly = false, required = false } = props

  const [hasErrorText, setHasErrorText] = React.useState(false)
  const [hasDescription, setHasDescription] = React.useState(false)

  const uid = React.useId()
  const id = props.id ?? uid
  const rootRef = React.useRef<HTMLDivElement>(null)

  const rootId = ids?.control ?? `field::${id}`
  const errorTextId = ids?.errorText ?? `field::${id}::error-text`
  const descriptionId = ids?.description ?? `field::${id}::description`
  const labelId = ids?.label ?? `field::${id}::label`

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
        id: rootId,
        ref: rootRef,
      }) as React.HTMLAttributes<HTMLElement>,
    [disabled, invalid, readOnly, rootId],
  )

  const getLabelProps = React.useMemo(
    () => () =>
      ({
        ...parts.label.attrs,
        id: labelId,
        htmlFor: id,
      }) as React.LabelHTMLAttributes<HTMLLabelElement>,
    [disabled, invalid, readOnly, required, id, labelId],
  )

  const getControlProps = React.useMemo(
    () => () =>
      ({
        'aria-describedby': labelIds,
        'aria-invalid': ariaAttr(invalid),
        id,
        required,
        disabled,
        readOnly,
      }) as React.HTMLAttributes<HTMLElement>,
    [labelIds, invalid, required, readOnly, id, disabled],
  )

  const getInputProps = React.useMemo(
    () => () =>
      ({
        ...getControlProps(),
        ...parts.input.attrs,
      }) as React.HTMLAttributes<HTMLInputElement>,
    [getControlProps],
  )

  const getTextareaProps = React.useMemo(
    () => () =>
      ({
        ...getControlProps(),
        ...parts.textarea.attrs,
      }) as React.HTMLAttributes<HTMLTextAreaElement>,
    [getControlProps],
  )

  const getSelectProps = React.useMemo(
    () => () =>
      ({
        ...getControlProps(),
        ...parts.select.attrs,
      }) as React.HTMLAttributes<HTMLSelectElement>,
    [getControlProps],
  )

  const getDescriptionProps = React.useMemo(
    () => () =>
      ({
        id: descriptionId,
        ...parts.description.attrs,
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
      root: rootId,
      control: id,
      label: labelId,
      errorText: errorTextId,
      description: descriptionId,
    },
    refs: {
      rootRef,
    },
    disabled,
    invalid,
    readOnly,
    required,
    getLabelProps,
    getRootProps,
    getInputProps,
    getTextareaProps,
    getSelectProps,
    getDescriptionProps,
    getErrorTextProps,
  }
}
