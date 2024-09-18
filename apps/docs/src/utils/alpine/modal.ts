import type { Alpine, ElementWithXAttributes } from "alpinejs";

export default function (Alpine: Alpine) {
  Alpine.directive('modal', (el, directive) => {
    if (directive.value === 'title') modalTitle(el, Alpine)
    else if (directive.value === 'description') modalDescription(el, Alpine)
    else if (directive.value === 'backdrop') modalBackdrop(el, Alpine)
    else if (directive.value === 'dialog') modalDialog(el, Alpine)
    else if (directive.value === 'content') modalContent(el, Alpine)
    else if (directive.value === 'trigger') modalTrigger(el, Alpine)
    else if (directive.value === 'close-button') modalCloseButton(el, Alpine)
    else modalRoot(el, Alpine)
  })

  Alpine.magic('modal', el => {
    const $data = Alpine.$data(el)

    return {
      get isOpen() {
        return $data.isOpen
      },
      close() {
        return $data.close()
      }
    }
  })

}

const modalRoot = (el: ElementWithXAttributes<HTMLElement>, Alpine: Alpine) => {
  Alpine.bind(el, {
    'x-data'() {
      return {
        isOpen: false,
        isDismissable: true,
        open() {
          return this.isOpen = true
        },
        close() {
          return this.isOpen = false
        }
      }
    },
    'x-id'() {
      return ['modal-title', 'modal-description']
    },
  })
}

const modalTitle = (el: ElementWithXAttributes<HTMLElement>, Alpine: Alpine) => {
  Alpine.bind(el, {
    ':id'() {
      return this.$id('modal-title')
    },
    'x-init'() {
      if (this.isOpen === undefined) console.warn('"x-modal:title" is missing a parent element with "x-modal".')
    },
  })
}

const modalDescription = (el: ElementWithXAttributes<HTMLElement>, Alpine: Alpine) => {
  Alpine.bind(el, {
    ':id'() {
      return this.$id('modal-description')
    },
    'x-init'() {
      if (this.isOpen === undefined) console.warn('"x-modal:description" is missing a parent element with "x-modal".')
    },
  })
}

const modalBackdrop = (el: ElementWithXAttributes<HTMLElement>, Alpine: Alpine) => {
  Alpine.bind(el, {
    ':aria-haspopup'() {
      return 'true'
    },
    ':aria-hidden'() {
      return 'true'
    },
    'x-show'() {
      return this.isOpen
    },
    '@click.stop.prevent'() {
      if (this.isDismissable) this.close()
      return
    },
  })
}

const modalDialog = (el: ElementWithXAttributes<HTMLElement>, Alpine: Alpine) => {
  Alpine.bind(el, {
    'x-init'() {
      if (this.isOpen === undefined) console.warn('"x-modal:dialog" is missing a parent element with "x-modal".')
      this.isDismissable = !el.hasAttribute('data-force-action')
    },
    ':tabIndex'() {
      return -1
    },
    ':aria-labelledby'() {
      return this.$id('modal-title')
    },
    ':aria-describedby'() {
      return this.$id('modal-description')
    },
    ':aria-modal'() {
      return 'true'
    },
    ':role'() {
      return 'dialog'
    },
    'x-show'() {
      return this.isOpen
    },
    'x-trap.inert.noscroll'() {
      return this.isOpen
    },
    '@keydown.stop.prevent.escape'() {
      if (this.isDismissable) this.close()
      return
    },
  })
}

const modalContent = (el: ElementWithXAttributes<HTMLElement>, Alpine: Alpine) => {
  Alpine.bind(el, {
    'x-init'() {
      if (this.isOpen === undefined) console.warn('"x-modal:content" is missing a parent element with "x-modal".')
    },
    '@click.outside'() {
      if (this.isDismissable) this.close()
      return
    },
  })
}

const modalTrigger = (el: ElementWithXAttributes<HTMLElement>, Alpine: Alpine) => {
  Alpine.bind(el, {
    'x-init'() {
      if (this.isOpen === undefined) console.warn('"x-modal:trigger" is missing a parent element with "x-modal".')
    },
    '@click'() {
      this.isOpen ? this.close() : this.open()
    }
  })
}

const modalCloseButton = (el: ElementWithXAttributes<HTMLElement>, Alpine: Alpine) => {
  Alpine.bind(el, {
    'x-init'() {
      if (this.isOpen === undefined) console.warn('"x-modal:close-button" is missing a parent element with "x-modal".')
    },
    '@click'() {
      this.close()
    }
  })
}
