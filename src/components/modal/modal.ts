import { Alpine, ElementWithXAttributes } from "alpinejs";

export default function (Alpine: Alpine) {
  Alpine.directive('modal', (el, directive) => {
    if (directive.value === 'title') modalTitle(el, Alpine)
    else if (directive.value === 'description') modalDescription(el, Alpine)
    else if (directive.value === 'backdrop') modalBackdrop(el, Alpine)
    else if (directive.value === 'dialog') modalDialog(el, Alpine)
    else if (directive.value === 'content') modalContent(el, Alpine)
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
        isOpenExternal: false,
        get isOpen() {
          return this.isOpenExternal
        },
        isDismissable: true,
        open() {
          return this.isOpenExternal = true
        },
        close() {
          return this.isOpenExternal = false
        }
      }
    },
    'x-id'() {
      return ['modal', 'modal-title', 'modal-description']
    },
    // Enables two way binding from internal and external x-model
    'x-modelable': 'isOpenExternal',
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
      return true
    },
    ':aria-hidden'() {
      return true
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
    ':tabIndex'() {
      return -1
    },
    ':id'() {
      return this.$id('modal')
    },
    ':aria-labelledby'() {
      return this.$id('modal-title')
    },
    ':aria-describedby'() {
      return this.$id('modal-description')
    },
    ':aria-modal'() {
      return true
    },
    ':role'() {
      return 'dialog'
    },
    'x-init'() {
      if (this.isOpen === undefined) console.warn('"x-modal:dialog" is missing a parent element with "x-modal".')
      this.isDismissable = !el.hasAttribute('data-force-action')
    },
    'x-show'() {
      return this.isOpen
    },
    'x-trap.inert.noscroll'() {
      return this.isOpen
    },
    '@keydown.escape.prevent.stop'() {
      if (this.isDismissable) this.close()
      return
    },
  })
}

const modalContent = (el: ElementWithXAttributes<HTMLElement>, Alpine: Alpine) => {
  Alpine.bind(el, {
    '@click.outside'() {
      if (this.isDismissable) this.close()
      return
    },
  })
}
