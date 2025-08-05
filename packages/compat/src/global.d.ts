import type { CharacterCount } from './character-count'
import type { Collapse } from './collapse'
import type { FileInput } from './file-input'
import type { InputMask } from './input-mask'
import type { Modal } from './modal'

declare global {
  interface Window {
    Accordion: typeof Accordion
    accordionInit: () => void

    Modal: typeof Modal
    modalInit: () => void

    Collapse: typeof Collapse
    collapseInit: () => void

    CharacterCount: typeof CharacterCount
    characterCountInit: () => void

    InputMask: typeof InputMask
    inputMaskInit: () => void

    FileInput: typeof FileInput
    fileInputInit: () => void
  }
}
