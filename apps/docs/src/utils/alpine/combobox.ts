import type { Alpine, ElementWithXAttributes } from 'alpinejs'

export default function (Alpine: Alpine) {
  Alpine.directive('combobox', (el, directive) => {
    if (directive.value === 'input')
      comboboxInput(el, Alpine)
    else if (directive.value === 'label')
      comboboxLabel(el, Alpine)
    else if (directive.value === 'list')
      comboboxList(el, Alpine)
    else if (directive.value === 'item')
      comboboxListItem(el, Alpine)
    else if (directive.value === 'values')
      comboboxValues(el, Alpine)
    else if (directive.value === 'clear')
      comboboxClearButton(el, Alpine)
    else if (directive.value === 'toggle')
      comboboxToggleButton(el, Alpine)
    else comboboxRoot(el, Alpine)
  })

  Alpine.magic('combobox', (el) => {
    const $data = Alpine.$data(el)

    return {
      get allOptions() {
        return $data.allOptions
      },
      get isLoaded() {
        return $data.isLoaded
      },
      get noResults() {
        return $data.noResults
      },
    }
  })
}

function comboboxRoot(el: ElementWithXAttributes<HTMLElement>, Alpine: Alpine) {
  Alpine.bind(el, {
    'x-id': function () {
      return ['combobox-label', 'combobox-list', 'combobox-input']
    },
    'x-init': function () {
      this.isLoaded = true
      this.$watch('isOpen', (value) => {
        if (value && this.selectedEl) {
          this.$nextTick(() => {
            this.selectedEl.scrollIntoView()
          })
        }
        if (!value)
          this.activeEl = undefined
      })
    },
    'x-data': function () {
      return {
        listEl: undefined as HTMLElement | undefined,
        inputEl: undefined as HTMLElement | undefined,
        labelEl: undefined as HTMLElement | undefined,
        selectedEl: undefined as HTMLElement | undefined,
        activeEl: undefined as HTMLElement | undefined,
        inputValue: '',
        isLoaded: false,
        isOpen: false,
        isDirty: false,
        allOptions: [] as Array<{ label: string, value: string }>,
        get selectedValue() {
          return this.selectedEl ? this.selectedEl.textContent : ''
        },
        get noResults() {
          return this.isDirty && !this.allOptions.some(o => o.label.toLowerCase().startsWith(this.inputValue.toLowerCase()))
        },
        select(el: HTMLElement) {
          this.selectedEl = el
          this.inputEl.value = el.textContent
          this.isOpen = false
          this.isDirty = false
          this.$focus.focus(this.inputEl)
        },
        reset() {
          this.inputEl.value = ''
          this.inputValue = ''
          this.isDirty = false
          this.selectedEl = undefined
        },
        focusFirst() {
          const el = this.$focus.within(this.listEl).getFirst()
          if (el) {
            this.activeEl = el
            this.$focus.focus(el)
          }
        },
        focusLast() {
          const el = this.$focus.within(this.listEl).getLast()
          if (el) {
            this.activeEl = el
            this.$focus.focus(el)
          }
        },
        focusNext() {
          const el = this.$focus.within(this.listEl).getNext()
          if (el) {
            this.activeEl = el
            this.$focus.focus(el)
          }
          else {
            this.isOpen = false
            this.$focus.focus(this.inputEl)
          }
        },
        focusPrev() {
          const el = this.$focus.within(this.listEl).getPrevious()
          if (el) {
            this.activeEl = el
            this.$focus.focus(el)
          }
          else {
            this.isOpen = false
            this.$focus.focus(this.inputEl)
          }
        },
        focusSelected() {
          this.activeEl = this.selectedEl
          this.$focus.focus(this.selectedEl)
        },
        validateInput() {
          this.isOpen = false
          // If typed value matches an option value, set it as selectedEl
          if (this.isDirty) {
            const found = [...this.listEl.getElementsByTagName('LI')]
              .find(li => li.textContent === this.inputValue)
            this.selectedEl = found || this.selectedEl
          }
          this.isDirty = false
          this.inputEl.value = this.selectedValue
        },
      }
    },
    '@focusout': function () {
      if (!el.contains(this.$event.relatedTarget)) {
        this.validateInput()
      }
    },
  })
}

function comboboxValues(el: ElementWithXAttributes<HTMLElement>, Alpine: Alpine) {
  Alpine.bind(el, {
    'x-init': function () {
      el.id = ''
      el.hidden = true
      this.allOptions = [...el.children].map(o => ({ label: o.textContent, value: o.value }))
    },
  })
}

function comboboxInput(el: ElementWithXAttributes<HTMLElement>, Alpine: Alpine) {
  Alpine.bind(el, {
    ':type': function () {
      return 'text'
    },
    ':role': function () {
      return 'combobox'
    },
    ':autocapitalize': function () {
      return 'off'
    },
    ':autocomplete': function () {
      return 'off'
    },
    ':id': function () {
      return this.$id('combobox-input')
    },
    ':aria-expanded': function () {
      return this.isOpen
    },
    ':aria-activedescendant': function () {
      return this.activeEl ? this.activeEl.id : undefined
    },
    ':aria-controls': function () {
      return this.$id('combobox-list')
    },
    ':aria-owns': function () {
      return this.$id('combobox-list')
    },
    'x-init': function () {
      this.inputEl = el
    },
    '@mousedown': function () {
      this.isOpen = true
      this.activeEl = undefined
    },
    '@input': function () {
      this.inputValue = el.value
      this.isOpen = true
      this.isDirty = true
      if (!el.value) {
        this.reset()
      }
    },
    '@keydown.prevent.up': function () {
      this.isOpen = true
      this.$nextTick(() => {
        this.selectedEl ? this.focusSelected() : this.focusLast()
      })
    },
    '@keydown.prevent.down': function () {
      this.isOpen = true
      this.$nextTick(() => {
        this.selectedEl ? this.focusSelected() : this.focusFirst()
      })
    },
  })
}

function comboboxList(el: ElementWithXAttributes<HTMLElement>, Alpine: Alpine) {
  Alpine.bind(el, {
    ':role': function () {
      return 'listbox'
    },
    ':id': function () {
      return this.$id('combobox-list')
    },
    ':tabindex': function () {
      return '-1'
    },
    ':aria-labelledby': function () {
      return this.$id('combobox-label')
    },
    'x-init': function () {
      return this.listEl = el
    },
    'x-show': function () {
      return this.isOpen
    },
    'x-anchor.bottom': function () {
      return this.inputEl
    },
    '@keydown.prevent.up': function () {
      this.focusPrev()
    },
    '@keydown.prevent.down': function () {
      this.focusNext()
    },
    '@keydown.prevent.home': function () {
      this.focusFirst()
    },
    '@keydown.prevent.end': function () {
      this.focusLast()
    },
    '@keydown.prevent.shift.tab': function () {
      return false
    },
  })
}

function comboboxClearButton(el: ElementWithXAttributes<HTMLElement>, Alpine: Alpine) {
  Alpine.bind(el, {
    ':type': function () {
      return 'button'
    },
    ':aria-label': function () {
      return 'clear input'
    },
    ':tabindex': function () {
      return '-1'
    },
    'x-show': function () {
      return !!this.selectedValue
    },
    '@mouseup.prevent': function () {
      this.reset()
      this.$focus.focus(this.inputEl)
    },
  })
}

function comboboxToggleButton(el: ElementWithXAttributes<HTMLElement>, Alpine: Alpine) {
  Alpine.bind(el, {
    ':type': function () {
      return 'button'
    },
    ':aria-label': function () {
      return 'toggle options'
    },
    ':tabindex': function () {
      return '-1'
    },
    '@mouseup.prevent': function () {
      this.isOpen = !this.isOpen
      this.$focus.focus(this.inputEl)
    },
  })
}

function comboboxListItem(el: ElementWithXAttributes<HTMLElement>, Alpine: Alpine) {
  Alpine.bind(el, {
    ':role': function () {
      return 'option'
    },
    ':id': function () {
      return this.$id('combobox-item')
    },
    ':aria-selected': function () {
      return el === this.selectedEl
    },
    ':data-active': function () {
      return el === this.activeEl
    },
    ':tabIndex': function () {
      return el === this.activeEl ? 0 : -1
    },
    'x-init': function () {
      this.$nextTick(() => {
        this.label = el.textContent
      })
    },
    'x-data': function () {
      return {
        label: '',
      }
    },
    'x-show': function () {
      return this.isDirty ? this.$data.label.toLowerCase().startsWith(this.inputValue.toLowerCase()) : true
    },
    '@mousedown.prevent': function () {
      return true
    },
    '@mouseup.prevent': function () {
      this.select(el)
      this.isDirty = false
      this.isOpen = false
    },
    '@keydown.prevent.enter': function () {
      this.select(el)
      this.isDirty = false
      this.isOpen = false
    },
    '@mousemove.prevent': function () {
      this.activeEl = el
      this.$focus.focus(el)
    },
    '@keydown.prevent.esc': function () {
      this.isOpen = false
      this.$focus.focus(this.inputEl)
    },
  })
}

function comboboxLabel(el: ElementWithXAttributes<HTMLElement>, Alpine: Alpine) {
  Alpine.bind(el, {
    ':id': function () {
      return this.$id('combobox-label')
    },
    ':for': function () {
      return this.$id('combobox-input')
    },
    'x-init': function () {
      this.labelEl = el
    },
    '@click': function () {
      this.isOpen = true
    },
  })
}
