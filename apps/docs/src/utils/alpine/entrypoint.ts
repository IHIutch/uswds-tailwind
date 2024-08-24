import type { Alpine } from 'alpinejs'
import focus from "@alpinejs/focus"
import mask from "@alpinejs/mask"
import anchor from "@alpinejs/anchor"

import accordion from "#utils/alpine/accordion"
import inputMask from "#utils/alpine/input-mask"
import modal from "#utils/alpine/modal"
import combobox from "#utils/alpine/combobox"
import collapse from "#utils/alpine/collapse"
import dropdown from "#utils/alpine/dropdown"
import tooltip from "#utils/alpine/tooltip"
import characterCount from "#utils/alpine/character-count"
import fileInput from "#utils/alpine/file-input"

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
}
