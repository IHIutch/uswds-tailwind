import type { Alpine, ElementWithXAttributes } from 'alpinejs'

export default function (Alpine: Alpine) {
  Alpine.directive('dropdown', (el, directive) => {
    if (directive.value === 'trigger')
      dropdownTrigger(el, Alpine)
    else if (directive.value === 'content')
      dropdownContent(el, Alpine)
    else if (directive.value === 'item')
      dropdownItem(el, Alpine)
    else dropdownRoot(el, Alpine)
  })

  Alpine.magic('dropdown', (el) => {
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
      },
    }
  })
}

function dropdownRoot(el: ElementWithXAttributes<HTMLElement>, Alpine: Alpine) {
  Alpine.bind(el, {
    'x-data': function () {
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
        },
      }
    },
    'x-init': function () {
      this.rootEl = el
    },
    'x-id': function () {
      return ['dropdown-trigger', 'dropdown-content']
    },
    '@focusout': function () {
      if (!el.contains(this.$event.relatedTarget)) {
        this.close()
      }
    },
  })
}

function dropdownContent(el: ElementWithXAttributes<HTMLElement>, Alpine: Alpine) {
  Alpine.bind(el, {
    ':role': function () {
      return 'menu'
    },
    ':aria-labelledby': function () {
      return this.$id('dropown-trigger')
    },
    ':tabIndex': function () {
      return -1
    },
    'x-init': function () {
      if (this.isOpen === undefined)
        console.warn('"x-dropdown:content" is missing a parent element with "x-dropdown".')
      this.contentEl = el
    },
    'x-show': function () {
      return this.isOpen
    },
    'x-anchor.bottom-start': function () {
      return this.triggerEl
    },
    '@keydown.prevent.escape': function () {
      this.close()
      this.$focus.focus(this.triggerEl)
    },
    '@keydown.prevent.up': function () {
      if (this.$focus.within(this.contentEl).getPrevious()) {
        this.$focus.within(this.contentEl).wrap().previous()
      }
      else {
        this.$focus.within(this.contentEl).last()
      }
    },
    '@keydown.prevent.down': function () {
      if (this.$focus.within(this.contentEl).getNext()) {
        this.$focus.within(this.contentEl).wrap().next()
      }
      else {
        this.$focus.within(this.contentEl).first()
      }
    },
    '@keydown.prevent.home': function () {
      this.$focus.within(this.contentEl).first()
    },
    '@keydown.prevent.end': function () {
      this.$focus.within(this.contentEl).last()
    },
  })
}

function dropdownItem(el: ElementWithXAttributes<HTMLElement>, Alpine: Alpine) {
  Alpine.bind(el, {
    ':role': function () {
      return 'menuitem'
    },
    ':tabIndex': function () {
      return -1
    },
    'x-init': function () {
      if (this.isOpen === undefined)
        console.warn('"x-dropdown:item" is missing a parent element with "x-dropdown".')
    },
    '@click': function () {
      this.close()
      this.$focus.focus(this.triggerEl)
    },
    '@keydown.stop.prevent.space': function () {
      this.$event.target.click()
    },
    '@keydown.stop.prevent.enter': function () {
      this.$event.target.click()
    },
  })
}

function dropdownTrigger(el: ElementWithXAttributes<HTMLElement>, Alpine: Alpine) {
  Alpine.bind(el, {
    ':aria-controls': function () {
      return this.$id('dropdown-content')
    },
    ':aria-expanded': function () {
      return this.isOpen
    },
    ':aria-haspopup': function () {
      return true
    },
    'x-init': function () {
      if (this.isOpen === undefined)
        console.warn('"x-dropdown:trigger" is missing a parent element with "x-dropdown".')
      this.triggerEl = el
    },
    '@click': function () {
      this.toggle()
    },
    '@keydown.prevent.enter': function () {
      this.open()
      this.$focus.within(this.contentEl).first()
    },
    '@keydown.prevent.space': function () {
      this.open()
      this.$focus.within(this.contentEl).first()
    },
    '@keydown.prevent.up': function () {
      this.open()
      this.$focus.within(this.contentEl).last()
    },
    '@keydown.prevent.down': function () {
      this.open()
      this.$focus.within(this.contentEl).first()
    },
    '@keydown.prevent.home': function () {
      this.open()
      this.$focus.within(this.contentEl).first()
    },
    '@keydown.prevent.end': function () {
      this.open()
      this.$focus.within(this.contentEl).last()
    },
  })
}
