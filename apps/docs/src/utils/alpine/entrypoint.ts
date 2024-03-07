import type { Alpine } from 'alpinejs'
import focus from '@alpinejs/focus'
import mask from '@alpinejs/mask'
import anchor from '@alpinejs/anchor'
import accordion from '#utils/alpine/accordion'

export default (Alpine: Alpine) => {
  Alpine.plugin(focus);
  Alpine.plugin(mask);
  Alpine.plugin(anchor);

  Alpine.plugin(accordion)
}
