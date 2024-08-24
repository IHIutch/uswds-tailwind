import type { Alpine, ElementWithXAttributes } from "alpinejs"

const validPositions = ['top', 'top-start', 'top-end', 'right', 'right-start', 'right-end', 'bottom', 'bottom-start', 'bottom-end', 'left', 'left-start', 'left-end']

export default function (Alpine: Alpine) {
  Alpine.directive('tooltip', (el, directive) => {
    if (directive.value === 'trigger') tooltipTrigger(el, Alpine)
    else if (directive.value === 'content') tooltipContent(el, Alpine)
    else tooltipRoot(el, Alpine)
  })
}

const tooltipRoot = (el: ElementWithXAttributes<HTMLElement>, Alpine: Alpine) => {
  Alpine.bind(el, {
    'x-data'() {
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
    'x-init'() {
      this.rootEl = el;
      this.isOpen = false;
      if (el.dataset.position) {
        this.position = el.dataset.position
      }
      if (!validPositions.includes(this.position)) {
        console.warn(`Tooltip "data-position" of "${el.dataset.position}" is invalid. Defaulting to "top".`)
      }
    },
    'x-id'() {
      return ['tooltip-content']
    },
  })
}

const tooltipContent = (el: ElementWithXAttributes<HTMLElement>, Alpine: Alpine) => {
  Alpine.bind(el, {
    ':id'() {
      return this.$id('tooltip-content')
    },
    ':aria-hidden'() {
      return this.isOpen ? 'false' : 'true'
    },
    ':role'() {
      return 'tooltip'
    },
    'x-init'() {
      if (this.isOpen === undefined) console.warn('"x-tooltip:content" is missing a parent element with "x-tooltip".')
    },
    'x-show'() {
      return this.isOpen
    },
    'x-bind'() {
      return {
        [`x-anchor.${this.position}.offset.5`]() {
          return this.triggerEl;
        },
      };
    },
  })
}

const tooltipTrigger = (el: ElementWithXAttributes<HTMLElement>, Alpine: Alpine) => {
  Alpine.bind(el, {
    ':aria-describedby'() {
      return this.$id('tooltip-content')
    },
    'x-init'() {
      if (this.isOpen === undefined) console.warn('"x-tooltip:trigger" is missing a parent element with "x-tooltip".')
      this.triggerEl = el
    },
    '@mouseover'() {
      this.open()
    },
    '@mouseleave'() {
      this.close()
    }
  })
}
