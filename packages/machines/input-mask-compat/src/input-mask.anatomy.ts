import { createAnatomy } from '@zag-js/anatomy'

export const anatomy = createAnatomy('inputMask').parts('root', 'content', 'input')

export const parts = anatomy.build()
