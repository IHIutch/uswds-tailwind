import { Alpine, ElementWithXAttributes } from "alpinejs"
// import { debounce } from "../../utils/debounce"

export default function (Alpine: Alpine) {
  Alpine.directive('character-count', (el, directive) => {
    if (directive.value === 'input') characterCountInput(el, Alpine)
    else if (directive.value === 'status') characterCountStatus(el, Alpine)
    else if (directive.value === 'sr-status') srCharacterCountStatus(el, Alpine)
    else characterCountRoot(el, Alpine)
  })
}

const characterCountRoot = (el: ElementWithXAttributes<HTMLElement>, Alpine: Alpine) => {
  Alpine.bind(el, {
    'x-id'() {
      return ['character-count-input', 'character-count-status']
    },
    'x-data'() {
      return {
        isInitialized: false,
        maxLength: undefined,
        charCount: 0,
        charsRemaining: 0,
        srStatusText: '',
        get statusText() {
          if (this.maxLength) {
            if (this.charCount === 0) {
              return `${this.maxLength} characters allowed`
            } else if (this.charCount === 1) {
              return `${this.charsRemaining} character left`
            } else if (this.charCount === -1) {
              return `${Math.abs(this.charsRemaining)} character over limit`
            } else if (this.charsRemaining < 0) {
              return `${Math.abs(this.charsRemaining)} characters over limit`
            } else {
              return `${this.charsRemaining} characters left`
            }
          } else {
            return undefined
          }
        },
        get isInvalid() {
          return this.charsRemaining < 0 ? true : false
        },

        debounceTimer: undefined,
        debounceSetSrStatusText() {
          // debounce(() => {
          //   this.srStatusText = this.statusText
          // }, 1000, false)()

          clearTimeout(this.debounceTimer);
          this.debounceTimer = setTimeout(() => {
            this.srStatusText = this.statusText
          }, 1000);
        }
      }
    },
    'x-init'() {
      this.$watch('isInvalid', value => {
        return value ? el.setAttribute('data-invalid', 'true') : el.removeAttribute('data-invalid')
      })
    },
  })
}

const characterCountInput = (el: ElementWithXAttributes<HTMLElement>, Alpine: Alpine) => {
  Alpine.bind(el, {
    'x-init'() {
      if (this.isInitialized === undefined) console.warn('"x-character-count:input" is missing a parent element with "x-character-count".')
      if (el.maxLength <= 0) {
        console.error(`Invalid or no "maxlength" attribute set on element #${el.id}`)
      } else {
        this.maxLength = Number(el.maxLength)
        el.removeAttribute('maxlength')
      }

      this.$watch('isInvalid', value => {
        if (value) {
          el.setAttribute('data-invalid', 'true')
          el.setAttribute('aria-invalid', 'true')
        } else {
          el.removeAttribute('data-invalid')
          el.removeAttribute('aria-invalid')
        }
      })
    },
    '@input'() {
      this.charCount = el.value.length
      this.charsRemaining = this.maxLength - this.charCount
      this.debounceSetSrStatusText()
    },
  })
}

const characterCountStatus = (el: ElementWithXAttributes<HTMLElement>, Alpine: Alpine) => {
  Alpine.bind(el, {
    'x-init'() {
      if (this.isInitialized === undefined) console.warn('"x-character-count:status" is missing a parent element with "x-character-count".')

      this.$watch('isInvalid', value => {
        return value ? el.setAttribute('data-invalid', 'true') : el.removeAttribute('data-invalid')
      })
    },
    'x-text'() {
      return this.statusText
    }
  })
}

const srCharacterCountStatus = (el: ElementWithXAttributes<HTMLElement>, Alpine: Alpine) => {
  Alpine.bind(el, {
    'x-init'() {
      if (this.isInitialized === undefined) console.warn('"x-character-count:status" is missing a parent element with "x-character-count".')

      this.srStatusText = this.statusText

      this.$watch('isInvalid', value => {
        return value ? el.setAttribute('data-invalid', 'true') : el.removeAttribute('data-invalid')
      })

    },
    'x-text'() {
      return this.srStatusText
    }
  })
}

