import { Alpine, ElementWithXAttributes } from "alpinejs"

export default function (Alpine: Alpine) {
  Alpine.directive('dropdown', (el, directive) => {
    if (directive.value === 'trigger') dropdownTrigger(el, Alpine)
    else if (directive.value === 'content') dropdownContent(el, Alpine)
    else if (directive.value === 'item') dropdownItem(el, Alpine)
    else dropdownRoot(el, Alpine)
  })

  Alpine.magic('dropdown', el => {
    const $data = Alpine.$data(el)

    return {
      get isOpen() {
        return $data.isOpen
      },
      open() {
        return $data.open()
      },
      close() {
        return $data.close()
      }
    }
  })
}

const dropdownRoot = (el: ElementWithXAttributes<HTMLElement>, Alpine: Alpine) => {
  Alpine.bind(el, {
    'x-data'() {
      return {
        contentEl: undefined as HTMLElement | undefined,
        triggerEl: undefined as HTMLElement | undefined,
        rootEl: undefined as HTMLElement | undefined,
        isOpen: false,
        open() {
          return this.isOpen = true
        },
        close() {
          return this.isOpen = false
        },
        toggle() {
          return this.isOpen = !this.isOpen
        }
      }
    },
    'x-init'() {
      this.rootEl = el;
    },
    'x-id'() {
      return ['dropdown-trigger', 'dropdown-content']
    },
    '@focusout'() {
      if (!el.contains(this.$event.relatedTarget)) {
        this.close()
      }
    },
  })
}

const dropdownContent = (el: ElementWithXAttributes<HTMLElement>, Alpine: Alpine) => {
  Alpine.bind(el, {
    'role': 'menu',
    ':aria-labelledby'() {
      return this.$id('dropown-trigger')
    },
    ':tabIndex'() {
      return -1
    },
    'x-init'() {
      if (this.isOpen === undefined) console.warn('"x-dropdown:content" is missing a parent element with "x-dropdown".')
      this.contentEl = el
    },
    'x-show'() {
      return this.isOpen
    },
    'x-anchor.bottom-start'() {
      return this.triggerEl;
    },
    '@keydown.escape.prevent'() {
      this.close()
      this.$focus.focus(this.triggerEl)
    },
    '@keydown.prevent.up'() {
      if (this.$focus.within(this.contentEl).getPrevious()) {
        this.$focus.within(this.contentEl).wrap().previous()
      } else {
        this.$focus.within(this.contentEl).last()
      }
    },
    '@keydown.prevent.down'() {
      if (this.$focus.within(this.contentEl).getNext()) {
        this.$focus.within(this.contentEl).wrap().next()
      } else {
        this.$focus.within(this.contentEl).first()
      }
    },
    '@keydown.prevent.home'() {
      this.$focus.within(this.contentEl).first()
    },
    '@keydown.prevent.end'() {
      this.$focus.within(this.contentEl).last()
    },
  })
}

const dropdownItem = (el: ElementWithXAttributes<HTMLElement>, Alpine: Alpine) => {
  Alpine.bind(el, {
    'role': 'menuitem',
    ':tabIndex'() {
      return -1
    },
    'x-init'() {
      if (this.isOpen === undefined) console.warn('"x-dropdown:item" is missing a parent element with "x-dropdown".')
    },
    '@click'() {
      this.close()
      this.$focus.focus(this.triggerEl)
    },
    '@keydown.space.stop.prevent'() {
      this.$event.target.click()
    },
    '@keydown.enter.stop.prevent'() {
      this.$event.target.click()
    },
  })
}

const dropdownTrigger = (el: ElementWithXAttributes<HTMLElement>, Alpine: Alpine) => {
  Alpine.bind(el, {
    ':aria-controls'() {
      return this.$id('dropdown-content')
    },
    ':aria-expanded'() {
      return this.isOpen
    },
    ':aria-haspopup'() {
      return true
    },
    'x-init'() {
      if (this.isOpen === undefined) console.warn('"x-dropdown:trigger" is missing a parent element with "x-dropdown".')
      this.triggerEl = el;
    },
    '@click'() {
      this.toggle()
    },
    '@keydown.prevent.enter'() {
      this.open();
      this.$focus.within(this.contentEl).first()
    },
    '@keydown.prevent.space'() {
      this.open();
      this.$focus.within(this.contentEl).first()
    },
    '@keydown.prevent.up'() {
      this.open();
      this.$focus.within(this.contentEl).last()
    },
    '@keydown.prevent.down'() {
      this.open();
      this.$focus.within(this.contentEl).first()
    },
    '@keydown.prevent.home'() {
      this.open();
      this.$focus.within(this.contentEl).first()
    },
    '@keydown.prevent.end'() {
      this.open();
      this.$focus.within(this.contentEl).last()
    },
  })
}
