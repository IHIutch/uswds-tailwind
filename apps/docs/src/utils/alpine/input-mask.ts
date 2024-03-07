import type { Alpine, ElementWithXAttributes } from "alpinejs"

export default function (Alpine: Alpine) {
  Alpine.directive('input-mask', (el, directive) => {
    if (directive.value === 'input') inputMaskInput(el, Alpine)
    else inputMaskRoot(el, Alpine)
  })

  Alpine.magic('inputMask', el => {
    const $data = Alpine.$data(el)

    return {
      get maskValue() {
        return $data.maskPlaceholder.split('').map((val, idx) => $data.inputValue[idx] ? '' : val).join('')
      },
      get inputValue() {
        return $data.inputValue
      },
    }
  })

}

const inputMaskRoot = (el: ElementWithXAttributes<HTMLElement>, Alpine: Alpine) => {
  Alpine.bind(el, {
    'x-data'() {
      return {
        maskPlaceholder: '',
        inputValue: ''
      }
    }
  })
}

const inputMaskInput = (el: ElementWithXAttributes<HTMLElement>, Alpine: Alpine) => {
  Alpine.bind(el, {
    'x-init'() {
      if (this.inputValue === undefined) console.warn('"x-input-mask:input" is missing a parent element with "x-input-mask".')
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
