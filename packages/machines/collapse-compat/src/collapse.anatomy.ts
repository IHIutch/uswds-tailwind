import { createAnatomy } from '@zag-js/anatomy'

export const anatomy = createAnatomy('collapse').parts('root', 'trigger', 'content')

export const parts = anatomy.build()
