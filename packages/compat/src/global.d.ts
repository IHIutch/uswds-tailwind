import type { Accordion, accordionInit } from './accordion'
import type { CharacterCount, characterCountInit } from './character-count'
import type { Collapse, collapseInit } from './collapse'
import type { FileInput, fileInputInit } from './file-input'
import type { InputMask, inputMaskInit } from './input-mask'
import type { Modal, modalInit } from './modal'

declare global {
  interface Window {
    Accordion: typeof Accordion
    accordionInit: typeof accordionInit

    Modal: typeof Modal
    modalInit: typeof modalInit

    Collapse: typeof Collapse
    collapseInit: typeof collapseInit

    CharacterCount: typeof CharacterCount
    characterCountInit: typeof characterCountInit

    InputMask: typeof InputMask
    inputMaskInit: typeof inputMaskInit

    FileInput: typeof FileInput
    fileInputInit: typeof fileInputInit
  }
}
