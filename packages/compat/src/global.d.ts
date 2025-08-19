import type { Accordion, accordionInit } from './accordion'
import type { CharacterCount, characterCountInit } from './character-count'
import type { Collapse, collapseInit } from './collapse'
import type { FileInput, fileInputInit } from './file-input'
import type { InputMask, inputMaskInit } from './input-mask'
import type { Modal, modalInit } from './modal'
import type { Table, tableInit } from './table'

declare global {
  interface Window {
    Accordion: typeof Accordion
    accordionInit: typeof accordionInit

    Collapse: typeof Collapse
    collapseInit: typeof collapseInit

    CharacterCount: typeof CharacterCount
    characterCountInit: typeof characterCountInit

    FileInput: typeof FileInput
    fileInputInit: typeof fileInputInit

    InputMask: typeof InputMask
    inputMaskInit: typeof inputMaskInit

    Modal: typeof Modal
    modalInit: typeof modalInit

    Table: typeof Table
    tableInit: typeof tableInit
  }
}
