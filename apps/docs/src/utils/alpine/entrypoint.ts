import type { Alpine } from 'alpinejs'
import accordion from '#utils/alpine/accordion'
import characterCount from '#utils/alpine/character-count'
import collapse from '#utils/alpine/collapse'

import combobox from '#utils/alpine/combobox'
import dropdown from '#utils/alpine/dropdown'
import fileInput from '#utils/alpine/file-input'
import inputMask from '#utils/alpine/input-mask'
import modal from '#utils/alpine/modal'
import tooltip from '#utils/alpine/tooltip'
import anchor from '@alpinejs/anchor'
import focus from '@alpinejs/focus'
import mask from '@alpinejs/mask'

export default (Alpine: Alpine) => {
  Alpine.plugin(focus)
  Alpine.plugin(mask)
  Alpine.plugin(anchor)

  Alpine.plugin(accordion)
  Alpine.plugin(inputMask)
  Alpine.plugin(modal)
  Alpine.plugin(combobox)
  Alpine.plugin(collapse)
  Alpine.plugin(dropdown)
  Alpine.plugin(tooltip)
  Alpine.plugin(characterCount)
  Alpine.plugin(fileInput)

  Alpine.data('collapsible', () => ({
    init() {
      this.isCodeExpanded = this.$refs.code.offsetHeight < 400
    },
    isCodeExpanded: false,
    toggleExpanded() {
      this.isCodeExpanded = !this.isCodeExpanded
    },
    get isShowingButton() {
      return !this.isCodeExpanded
    },
    get isShowingClass() {
      return this.isCodeExpanded ? 'h-auto' : 'h-96'
    },
  }))
}
