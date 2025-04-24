import type { Alpine, ElementWithXAttributes } from 'alpinejs'

const validPositions = ['top', 'top-start', 'top-end', 'right', 'right-start', 'right-end', 'bottom', 'bottom-start', 'bottom-end', 'left', 'left-start', 'left-end']

export default function (Alpine: Alpine) {
  Alpine.directive('tooltip', (el, directive) => {
    if (directive.value === 'trigger')
      tooltipTrigger(el, Alpine)
    else if (directive.value === 'content')
      tooltipContent(el, Alpine)
    else tooltipRoot(el, Alpine)
  })
}

function tooltipRoot(el: ElementWithXAttributes<HTMLElement>, Alpine: Alpine) {
  Alpine.bind(el, {
    'x-data': function () {
      return {
        contentEl: undefined as HTMLElement | undefined,
        triggerEl: undefined as HTMLElement | undefined,
        rootEl: undefined as HTMLElement | undefined,
        isOpen: false,
        position: 'top',
        open() {
          return this.isOpen = true
        },
        close() {
          return this.isOpen = false
        },
      }
    },
    'x-init': function () {
      this.rootEl = el
      this.isOpen = false
      if (el.dataset.position) {
        this.position = el.dataset.position
      }
      if (!validPositions.includes(this.position)) {
        console.warn(`Tooltip "data-position" of "${el.dataset.position}" is invalid. Defaulting to "top".`)
      }
    },
    'x-id': function () {
      return ['tooltip-content']
    },
  })
}

function tooltipContent(el: ElementWithXAttributes<HTMLElement>, Alpine: Alpine) {
  Alpine.bind(el, {
    ':id': function () {
      return this.$id('tooltip-content')
    },
    ':aria-hidden': function () {
      return this.isOpen ? 'false' : 'true'
    },
    ':role': function () {
      return 'tooltip'
    },
    'x-init': function () {
      if (this.isOpen === undefined)
        console.warn('"x-tooltip:content" is missing a parent element with "x-tooltip".')
    },
    'x-show': function () {
      return this.isOpen
    },
    'x-transition.opacity.80ms': function () {
      return true
    },
    'x-bind': function () {
      return {
        [`x-anchor.${this.position}.offset.5`]() {
          return this.triggerEl
        },
      }
    },
  })
}

function tooltipTrigger(el: ElementWithXAttributes<HTMLElement>, Alpine: Alpine) {
  Alpine.bind(el, {
    ':aria-describedby': function () {
      return this.$id('tooltip-content')
    },
    'x-init': function () {
      if (this.isOpen === undefined)
        console.warn('"x-tooltip:trigger" is missing a parent element with "x-tooltip".')
      this.triggerEl = el
    },
    '@mouseover': function () {
      this.open()
    },
    '@mouseleave': function () {
      this.close()
    },
    '@focus': function () {
      this.open()
    },
    '@blur': function () {
      this.close()
    },
  })
}
