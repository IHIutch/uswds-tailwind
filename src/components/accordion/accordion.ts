import { Alpine, ElementWithXAttributes } from "alpinejs"

export default function (Alpine: Alpine) {
  Alpine.directive('accordion', (el, directive) => {
    if (directive.value === 'item') accordionItem(el, Alpine)
    else if (directive.value === 'trigger') accordionTrigger(el, Alpine)
    else if (directive.value === 'content') accordionContent(el, Alpine)
    else accordionRoot(el, Alpine)
  })

  Alpine.magic('accordion', el => {
    let $data = Alpine.$data(el)

    return {
      get value() {
        return $data.value
      },
      add(id: string) {
        $data.add(id)
      },
      remove(id: string) {
        $data.remove(id)
      }
    }
  })
}

const accordionRoot = (el: ElementWithXAttributes<HTMLElement>, Alpine: Alpine) => {
  Alpine.bind(el, {
    'x-data'() {
      return {
        rootEl: el,
        multiple: el.hasAttribute('data-multiple'),
        value: [],
        add(id: string) {
          return this.value = this.multiple ? [...this.value, id] : [id]
        },
        remove(id: string) {
          return this.value = this.value.filter((v: string) => v !== id)
        },
      }
    }
  })
}

const accordionItem = (el: ElementWithXAttributes<HTMLElement>, Alpine: Alpine) => {
  Alpine.bind(el, {
    'x-id'() {
      return ['accordion']
    },
  })
}

const accordionTrigger = (el: ElementWithXAttributes<HTMLElement>, Alpine: Alpine) => {
  Alpine.bind(el, {
    '@click'() {
      return this.value.includes(this.$id('accordion'))
        ? this.remove(this.$id('accordion'))
        : this.add(this.$id('accordion'))
    },
    ':aria-controls'() {
      return this.$id('accordion')
    },
    ':aria-expanded'() {
      return this.value.includes(this.$id('accordion'))
    },
    '@keydown.down'() {
      return this.$focus.within(this.$data.rootEl).wrap().next()
    },
    '@keydown.up'() {
      return this.$focus.within(this.$data.rootEl).wrap().previous()
    },
    '@keydown.home'() {
      return this.$focus.within(this.$data.rootEl).first()
    },
    '@keydown.end'() {
      return this.$focus.within(this.$data.rootEl).last()
    },
  })
}

const accordionContent = (el: ElementWithXAttributes<HTMLElement>, Alpine: Alpine) => {
  Alpine.bind(el, {
    'x-cloak'() {
      return true
    },
    ':id'() {
      return this.$id('accordion')
    },
    'x-show'() {
      return this.value.includes(this.$id('accordion'))
    },
  })
}
