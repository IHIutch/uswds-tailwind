import { Alpine, ElementWithXAttributes } from "alpinejs"

export default function (Alpine: Alpine) {
  Alpine.directive('collapse', (el, directive) => {
    if (directive.value === 'trigger') collapseTrigger(el, Alpine)
    else if (directive.value === 'content') collapseContent(el, Alpine)
    else collapseRoot(el, Alpine)
  })

  Alpine.magic('collapse', el => {
    let $data = Alpine.$data(el)

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

const collapseRoot = (el: ElementWithXAttributes<HTMLElement>, Alpine: Alpine) => {
  Alpine.bind(el, {
    'x-id'() {
      return ['collapse']
    },
    'x-data'() {
      return {
        isOpen: false,
        open() {
          this.isOpen = true
        },
        close() {
          this.isOpen = false
        },
        toggle() {
          this.isOpen = !this.isOpen
        }
      }
    },
    ':data-open'() {
      return this.isOpen || undefined
    }
  })
}

const collapseTrigger = (el: ElementWithXAttributes<HTMLElement>, Alpine: Alpine) => {
  Alpine.bind(el, {
    ':aria-expanded'() {
      return this.isOpen
    },
    ':aria-controls'() {
      return this.$id('collapse')
    },
    '@click'() {
      this.toggle()
    },
  })
}

const collapseContent = (el: ElementWithXAttributes<HTMLElement>, Alpine: Alpine) => {
  Alpine.bind(el, {
    ':id'() {
      return this.$id('collapse')
    },
    'x-cloak'() {
      return true
    },
    'x-show'() {
      return this.isOpen
    },
  })
}
