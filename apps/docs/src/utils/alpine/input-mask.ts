import type { Alpine, ElementWithXAttributes } from 'alpinejs'

export default function (Alpine: Alpine) {
  Alpine.directive('input-mask', (el, directive) => {
    if (directive.value === 'input')
      inputMaskInput(el, Alpine)
    if (directive.value === 'input-placeholder')
      inputMaskInputDisplay(el, Alpine)
    if (directive.value === 'mask-placeholder')
      inputMaskMaskDisplay(el, Alpine)
    else inputMaskRoot(el, Alpine)
  })
}

function inputMaskRoot(el: ElementWithXAttributes<HTMLElement>, Alpine: Alpine) {
  Alpine.bind(el, {
    'x-data': function () {
      return {
        maskPlaceholder: '',
        inputValue: '',
        isInitialized: false,
      }
    },
    'x-init': function () {
      this.isInitialized = true
    },
  })
}

function inputMaskInput(el: ElementWithXAttributes<HTMLElement>, Alpine: Alpine) {
  Alpine.bind(el, {
    'x-init': function () {
      if (this.isInitialized === undefined)
        console.warn('"x-input-mask:input" is missing a parent element with "x-input-mask".')
      if (el.placeholder) {
        this.maskPlaceholder = el.placeholder
        el.dataset.placeholder = el.placeholder
        el.removeAttribute('placeholder')
      }
    },
    '@input': function () {
      return this.$nextTick(() => {
        this.inputValue = el.value
      })
    },
  })
}

function inputMaskInputDisplay(el: ElementWithXAttributes<HTMLElement>, Alpine: Alpine) {
  Alpine.bind(el, {
    'x-init': function () {
      if (this.isInitialized === undefined)
        console.warn('"x-input-mask:input-placeholder" is missing a parent element with "x-input-mask".')
    },
    'x-text': function () {
      return this.inputValue
    },
  })
}

function inputMaskMaskDisplay(el: ElementWithXAttributes<HTMLElement>, Alpine: Alpine) {
  Alpine.bind(el, {
    'x-init': function () {
      if (this.isInitialized === undefined)
        console.warn('"x-input-mask:mask-placeholder" is missing a parent element with "x-input-mask".')
    },
    'x-text': function () {
      return this.maskPlaceholder.split('').map((val, idx) => this.inputValue[idx] ? '' : val).join('')
    },
  })
}
