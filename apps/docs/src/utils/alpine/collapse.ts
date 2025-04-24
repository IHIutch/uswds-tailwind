import type { Alpine, ElementWithXAttributes } from 'alpinejs'

export default function (Alpine: Alpine) {
  Alpine.directive('collapse', (el, directive) => {
    if (directive.value === 'trigger')
      collapseTrigger(el, Alpine)
    else if (directive.value === 'content')
      collapseContent(el, Alpine)
    else collapseRoot(el, Alpine)
  })

  Alpine.magic('collapse', (el) => {
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
      },
    }
  })
}

function collapseRoot(el: ElementWithXAttributes<HTMLElement>, Alpine: Alpine) {
  Alpine.bind(el, {
    'x-id': function () {
      return ['collapse']
    },
    'x-data': function () {
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
        },
      }
    },
    ':data-open': function () {
      return this.isOpen || undefined
    },
  })
}

function collapseTrigger(el: ElementWithXAttributes<HTMLElement>, Alpine: Alpine) {
  Alpine.bind(el, {
    ':aria-expanded': function () {
      return this.isOpen
    },
    ':aria-controls': function () {
      return this.$id('collapse')
    },
    '@click': function () {
      this.toggle()
    },
  })
}

function collapseContent(el: ElementWithXAttributes<HTMLElement>, Alpine: Alpine) {
  Alpine.bind(el, {
    ':id': function () {
      return this.$id('collapse')
    },
    'x-show': function () {
      return this.isOpen
    },
  })
}
