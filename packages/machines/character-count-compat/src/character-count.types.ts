import type { Machine, Service } from '@zag-js/core'
import type { CommonProperties, PropTypes, RequiredBy } from '@zag-js/types'

/* Element IDs */
export type ElementIds = Partial<{
  root: string
  control: string
  input: string
  description: string
  status: string
  srStatus: string
}>

/* Props */
export interface ValueChangeDetails {
  value: string
}

export interface CharacterCountProps extends CommonProperties {
  ids?: ElementIds | undefined
  /** Existing descriptions stay linked when the optional description mounts. */
  inputDescriptionIds?: string | undefined
  /** The allowed character count; the input has no native maxlength. */
  maxLength: number
  /** Initial uncontrolled value. */
  defaultValue?: string | undefined
  /** The owner must update this value to accept an edit. */
  value?: string | undefined
  /** Called when typing or setValue proposes a value. */
  onValueChange?: ((details: ValueChangeDetails) => void) | undefined
  /** @default "The content is too long." */
  errorText?: string | undefined
  /** @default "characters allowed" */
  statusLabel?: string | undefined
}

type PropsWithDefault = 'maxLength' | 'defaultValue' | 'errorText' | 'statusLabel'

/* Machine schema */
export interface CharacterCountSchema {
  props: RequiredBy<CharacterCountProps, PropsWithDefault>
  state: 'idle'
  context: {
    value: string
    srStatus: { text: string, politeness: 'polite' | 'assertive' | undefined }
    isDescriptionRendered: boolean
  }
  computed: {
    isOverLimit: boolean
    statusText: string
  }
  refs: {
    srAnnouncementCleanup: VoidFunction | undefined
    previousOverLimit: boolean
    descriptionRef: (node: HTMLElement | null) => void
  }
  action: 'setValue' | 'syncInputValidity' | 'announceValue'
  guard: never
  effect: 'trackSrStatus'
  event: { type: 'VALUE.SET', value: string }
}

export type CharacterCountService = Service<CharacterCountSchema>

export type CharacterCountMachine = Machine<CharacterCountSchema>

/* Consumer API */
export interface CharacterCountApi<T extends PropTypes = PropTypes> {
  count: number
  maxLength: number
  invalid: boolean
  statusText: string
  /** The screen-reader text follows the trailing debounce. */
  srStatusText: string

  /** Effective text, including the accepted controlled value. */
  value: string
  setValue: (value: string) => void

  getRootProps: () => T['element']
  getControlProps: () => T['element']
  getInputProps: () => T['input']
  getDescriptionProps: () => T['element']
  getStatusProps: () => T['element']
  getSrStatusProps: () => T['element']
}
