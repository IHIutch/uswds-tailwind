import type { Alpine, ElementWithXAttributes } from "alpinejs"

export default function (Alpine: Alpine) {
  Alpine.directive('input-mask', (el, directive) => {
    if (directive.value === 'input') inputMaskInput(el, Alpine)
    if (directive.value === 'input-display') inputMaskInputDisplay(el, Alpine)
    if (directive.value === 'mask-display') inputMaskMaskDisplay(el, Alpine)
    else inputMaskRoot(el, Alpine)
  })
}

const inputMaskRoot = (el: ElementWithXAttributes<HTMLElement>, Alpine: Alpine) => {
  Alpine.bind(el, {
    'x-data'() {
      return {
        maskPlaceholder: '',
        inputValue: '',
        isInitialized: false
      }
    },
    'x-init'() {
      this.isInitialized = true
    },
  })
}

const inputMaskInput = (el: ElementWithXAttributes<HTMLElement>, Alpine: Alpine) => {
  Alpine.bind(el, {
    'x-init'() {
      if (this.isInitialized === undefined) console.warn('"x-input-mask:input" is missing a parent element with "x-input-mask".')
      if (el.placeholder) {
        this.maskPlaceholder = el.placeholder
        el.dataset.placeholder = el.placeholder
        el.removeAttribute('placeholder')
      }
      return
    },
    '@input'() {
      return this.$nextTick(() => {
        this.inputValue = el.value
      })
    },
  })
}

const inputMaskInputDisplay = (el: ElementWithXAttributes<HTMLElement>, Alpine: Alpine) => {
  Alpine.bind(el, {
    'x-init'() {
      if (this.isInitialized === undefined) console.warn('"x-input-mask:input-display" is missing a parent element with "x-input-mask".')
    },
    'x-text'() {
      return this.inputValue
    }
  })
}

const inputMaskMaskDisplay = (el: ElementWithXAttributes<HTMLElement>, Alpine: Alpine) => {
  Alpine.bind(el, {
    'x-init'() {
      if (this.isInitialized === undefined) console.warn('"x-input-mask:mask-display" is missing a parent element with "x-input-mask".')
    },
    'x-text'() {
      return this.maskPlaceholder.split('').map((val, idx) => this.inputValue[idx] ? '' : val).join('')
    }
  })
}
