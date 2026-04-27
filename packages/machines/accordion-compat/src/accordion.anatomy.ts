import { createAnatomy } from '@zag-js/anatomy'

// .usa-accordion (root) > .usa-accordion__heading > .usa-accordion__button (trigger)
// .usa-accordion (root) > .usa-accordion__content (content)
export const anatomy = createAnatomy('accordion').parts('root', 'item', 'itemTrigger', 'itemContent')
export const parts = anatomy.build()
