import type { Alpine, ElementWithXAttributes } from "alpinejs";

export default function (Alpine: Alpine) {
  Alpine.directive('combobox', (el, directive) => {
    if (directive.value === 'input') comboboxInput(el, Alpine)
    else if (directive.value === 'label') comboboxLabel(el, Alpine)
    else if (directive.value === 'list') comboboxList(el, Alpine)
    else if (directive.value === 'item') comboboxListItem(el, Alpine)
    else if (directive.value === 'values') comboboxValues(el, Alpine)
    else if (directive.value === 'clear') comboboxClearButton(el, Alpine)
    else if (directive.value === 'toggle') comboboxToggleButton(el, Alpine)
    else comboboxRoot(el, Alpine)
  })

  Alpine.magic('combobox', el => {
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
      }
    }
  })

}

const comboboxRoot = (el: ElementWithXAttributes<HTMLElement>, Alpine: Alpine) => {
  Alpine.bind(el, {
    'x-id'() {
      return ['combobox-label', 'combobox-list', 'combobox-input']
    },
    'x-init'() {
      this.isLoaded = true;
      this.$watch('isOpen', value => {
        if (value && this.selectedEl) {
          this.$nextTick(() => {
            this.selectedEl.scrollIntoView();
          })
        }
        if (!value) this.activeEl = undefined
      })
    },
    'x-data'() {
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
          this.inputEl.value = el.textContent;
          this.isOpen = false;
          this.isDirty = false;
          this.$focus.focus(this.inputEl);
        },
        reset() {
          this.inputEl.value = '';
          this.inputValue = '';
          this.isDirty = false;
          this.selectedEl = undefined;
        },
        focusFirst() {
          const el = this.$focus.within(this.listEl).getFirst()
          if (el) {
            this.activeEl = el;
            this.$focus.focus(el)
          }
        },
        focusLast() {
          const el = this.$focus.within(this.listEl).getLast()
          if (el) {
            this.activeEl = el;
            this.$focus.focus(el)
          }
        },
        focusNext() {
          const el = this.$focus.within(this.listEl).getNext()
          if (el) {
            this.activeEl = el;
            this.$focus.focus(el)
          } else {
            this.isOpen = false;
            this.$focus.focus(this.inputEl)
          }
        },
        focusPrev() {
          const el = this.$focus.within(this.listEl).getPrevious()
          if (el) {
            this.activeEl = el;
            this.$focus.focus(el)
          } else {
            this.isOpen = false;
            this.$focus.focus(this.inputEl)
          }
        },
        focusSelected() {
          this.activeEl = this.selectedEl;
          this.$focus.focus(this.selectedEl)
        },
        validateInput() {
          this.isOpen = false
          // If typed value matches an option value, set it as selectedEl
          if (this.isDirty) {
            const found = [...this.listEl.getElementsByTagName('LI')]
              .find((li) => li.textContent === this.inputValue)
            this.selectedEl = found ? found : this.selectedEl
          }
          this.isDirty = false;
          this.inputEl.value = this.selectedValue
        }
      }
    },
    '@focusout'() {
      if (!el.contains(this.$event.relatedTarget)) {
        this.validateInput()
      }
    },
  })
}

const comboboxValues = (el: ElementWithXAttributes<HTMLElement>, Alpine: Alpine) => {
  Alpine.bind(el, {
    'x-init'() {
      el.id = '';
      el.hidden = true;
      this.allOptions = [...el.children].map((o) => ({ label: o.textContent, value: o.value }))
    }
  })
}

const comboboxInput = (el: ElementWithXAttributes<HTMLElement>, Alpine: Alpine) => {
  Alpine.bind(el, {
    ':type'() {
      return 'text'
    },
    ':role'() {
      return 'combobox'
    },
    ':autocapitalize'() {
      return 'off'
    },
    ':autocomplete'() {
      return 'off'
    },
    ':id'() {
      return this.$id('combobox-input')
    },
    ':aria-expanded'() {
      return this.isOpen
    },
    ':aria-activedescendant'() {
      return this.activeEl ? this.activeEl.id : undefined
    },
    ':aria-controls'() {
      return this.$id('combobox-list')
    },
    ':aria-owns'() {
      return this.$id('combobox-list')
    },
    'x-init'() {
      this.inputEl = el;
    },
    '@mousedown'() {
      this.isOpen = true;
      this.activeEl = undefined
    },
    '@input'() {
      this.inputValue = el.value;
      this.isOpen = true;
      this.isDirty = true;
      if (!el.value) {
        this.reset()
      }
    },
    '@keydown.prevent.up'() {
      this.isOpen = true;
      this.$nextTick(() => {
        this.selectedEl ? this.focusSelected() : this.focusLast()
      })
    },
    '@keydown.prevent.down'() {
      this.isOpen = true;
      this.$nextTick(() => {
        this.selectedEl ? this.focusSelected() : this.focusFirst()
      })
    },
    '@keydown.prevent.enter'() {
      this.value()
    },
  })
}


const comboboxList = (el: ElementWithXAttributes<HTMLElement>, Alpine: Alpine) => {
  Alpine.bind(el, {
    ':role'() {
      return 'listbox'
    },
    ':id'() {
      return this.$id('combobox-list')
    },
    ':tabindex'() {
      return '-1'
    },
    ':aria-labelledby'() {
      return this.$id('combobox-label')
    },
    'x-init'() {
      return this.listEl = el
    },
    'x-show'() {
      return this.isOpen
    },
    '@keydown.prevent.up'() {
      this.focusPrev()
    },
    '@keydown.prevent.down'() {
      this.focusNext()
    },
    '@keydown.prevent.home'() {
      this.focusFirst()
    },
    '@keydown.prevent.end'() {
      this.focusLast()
    },
    '@keydown.prevent.shift.tab'() {
      return false
    },
  })
}

const comboboxClearButton = (el: ElementWithXAttributes<HTMLElement>, Alpine: Alpine) => {
  Alpine.bind(el, {
    ':type'() {
      return 'button'
    },
    ':aria-label'() {
      return 'clear input'
    },
    ':tabindex'() {
      return '-1'
    },
    'x-show'() {
      return !!this.selectedValue
    },
    '@mouseup.prevent'() {
      this.reset();
      this.$focus.focus(this.inputEl);
    }
  })
}

const comboboxToggleButton = (el: ElementWithXAttributes<HTMLElement>, Alpine: Alpine) => {
  Alpine.bind(el, {
    ':type'() {
      return 'button'
    },
    ':aria-label'() {
      return 'toggle options'
    },
    ':tabindex'() {
      return '-1'
    },
    '@mouseup.prevent'() {
      this.isOpen = !this.isOpen;
      this.$focus.focus(this.inputEl)
    }
  })
}

const comboboxListItem = (el: ElementWithXAttributes<HTMLElement>, Alpine: Alpine) => {
  Alpine.bind(el, {
    ':role'() {
      return 'option'
    },
    ':id'() {
      return this.$id('combobox-item')
    },
    ':aria-selected'() {
      return el === this.selectedEl;
    },
    ':data-active'() {
      return el === this.activeEl;
    },
    ':tabIndex'() {
      return el === this.activeEl ? 0 : -1;
    },
    'x-init'() {
      this.$nextTick(() => {
        this.label = el.textContent
      })
    },
    'x-data'() {
      return {
        label: ''
      }
    },
    'x-show'() {
      return this.isDirty ? this.$data.label.toLowerCase().startsWith(this.inputValue.toLowerCase()) : true
    },
    '@mousedown.prevent'() {
      return true
    },
    '@mouseup.prevent'() {
      this.select(el);
      this.isDirty = false;
      this.isOpen = false;
    },
    '@keydown.prevent.enter'() {
      this.select(el);
      this.isDirty = false;
      this.isOpen = false;
    },
    '@keydown.prevent.space'() {
      this.select(el);
      this.isDirty = false;
      this.isOpen = false;
    },
    '@mousemove.prevent'() {
      this.activeEl = el
      this.$focus.focus(el)
    },
    '@keydown.prevent.esc'() {
      this.isOpen = false;
      this.$focus.focus(this.inputEl)
    },
  })
}

const comboboxLabel = (el: ElementWithXAttributes<HTMLElement>, Alpine: Alpine) => {
  Alpine.bind(el, {
    ':id'() {
      return this.$id('combobox-label')
    },
    ':for'() {
      return this.$id('combobox-input')
    },
    'x-init'() {
      this.labelEl = el
    },
    '@click'() {
      this.isOpen = true
    }
  })
}
