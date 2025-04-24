import type { Alpine, ElementWithXAttributes } from 'alpinejs'

export default function (Alpine: Alpine) {
  Alpine.directive('modal', (el, directive) => {
    if (directive.value === 'title')
      modalTitle(el, Alpine)
    else if (directive.value === 'description')
      modalDescription(el, Alpine)
    else if (directive.value === 'backdrop')
      modalBackdrop(el, Alpine)
    else if (directive.value === 'dialog')
      modalDialog(el, Alpine)
    else if (directive.value === 'content')
      modalContent(el, Alpine)
    else if (directive.value === 'trigger')
      modalTrigger(el, Alpine)
    else if (directive.value === 'close-button')
      modalCloseButton(el, Alpine)
    else modalRoot(el, Alpine)
  })

  Alpine.magic('modal', (el) => {
    const $data = Alpine.$data(el)

    return {
      get isOpen() {
        return $data.isOpen
      },
      close() {
        return $data.close()
      },
    }
  })
}

function modalRoot(el: ElementWithXAttributes<HTMLElement>, Alpine: Alpine) {
  Alpine.bind(el, {
    'x-data': function () {
      return {
        isOpen: false,
        isDismissable: true,
        open() {
          return this.isOpen = true
        },
        close() {
          return this.isOpen = false
        },
      }
    },
    'x-id': function () {
      return ['modal-title', 'modal-description']
    },
  })
}

function modalTitle(el: ElementWithXAttributes<HTMLElement>, Alpine: Alpine) {
  Alpine.bind(el, {
    ':id': function () {
      return this.$id('modal-title')
    },
    'x-init': function () {
      if (this.isOpen === undefined)
        console.warn('"x-modal:title" is missing a parent element with "x-modal".')
    },
  })
}

function modalDescription(el: ElementWithXAttributes<HTMLElement>, Alpine: Alpine) {
  Alpine.bind(el, {
    ':id': function () {
      return this.$id('modal-description')
    },
    'x-init': function () {
      if (this.isOpen === undefined)
        console.warn('"x-modal:description" is missing a parent element with "x-modal".')
    },
  })
}

function modalBackdrop(el: ElementWithXAttributes<HTMLElement>, Alpine: Alpine) {
  Alpine.bind(el, {
    ':aria-haspopup': function () {
      return 'true'
    },
    ':aria-hidden': function () {
      return 'true'
    },
    'x-show': function () {
      return this.isOpen
    },
    '@click.stop.prevent': function () {
      if (this.isDismissable)
        this.close()
    },
  })
}

function modalDialog(el: ElementWithXAttributes<HTMLElement>, Alpine: Alpine) {
  Alpine.bind(el, {
    'x-init': function () {
      if (this.isOpen === undefined)
        console.warn('"x-modal:dialog" is missing a parent element with "x-modal".')
      this.isDismissable = !el.hasAttribute('data-force-action')
    },
    ':tabIndex': function () {
      return -1
    },
    ':aria-labelledby': function () {
      return this.$id('modal-title')
    },
    ':aria-describedby': function () {
      return this.$id('modal-description')
    },
    ':aria-modal': function () {
      return 'true'
    },
    ':role': function () {
      return 'dialog'
    },
    'x-show': function () {
      return this.isOpen
    },
    'x-trap.inert.noscroll': function () {
      return this.isOpen
    },
    '@keydown.stop.prevent.escape': function () {
      if (this.isDismissable)
        this.close()
    },
  })
}

function modalContent(el: ElementWithXAttributes<HTMLElement>, Alpine: Alpine) {
  Alpine.bind(el, {
    'x-init': function () {
      if (this.isOpen === undefined)
        console.warn('"x-modal:content" is missing a parent element with "x-modal".')
    },
    '@click.outside': function () {
      if (this.isDismissable)
        this.close()
    },
  })
}

function modalTrigger(el: ElementWithXAttributes<HTMLElement>, Alpine: Alpine) {
  Alpine.bind(el, {
    'x-init': function () {
      if (this.isOpen === undefined)
        console.warn('"x-modal:trigger" is missing a parent element with "x-modal".')
    },
    '@click': function () {
      this.isOpen ? this.close() : this.open()
    },
  })
}

function modalCloseButton(el: ElementWithXAttributes<HTMLElement>, Alpine: Alpine) {
  Alpine.bind(el, {
    'x-init': function () {
      if (this.isOpen === undefined)
        console.warn('"x-modal:close-button" is missing a parent element with "x-modal".')
    },
    '@click': function () {
      this.close()
    },
  })
}
