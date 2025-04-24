import type { Alpine, ElementWithXAttributes } from 'alpinejs'

export default function (Alpine: Alpine) {
  Alpine.directive('accordion', (el, directive) => {
    if (directive.value === 'item')
      accordionItem(el, Alpine)
    else if (directive.value === 'trigger')
      accordionTrigger(el, Alpine)
    else if (directive.value === 'content')
      accordionContent(el, Alpine)
    else accordionRoot(el, Alpine)
  })

  Alpine.magic('accordion', (el) => {
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
      },
    }
  })
}

function accordionRoot(el: ElementWithXAttributes<HTMLElement>, Alpine: Alpine) {
  Alpine.bind(el, {
    'x-data': function () {
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
    },
  })
}

function accordionItem(el: ElementWithXAttributes<HTMLElement>, Alpine: Alpine) {
  Alpine.bind(el, {
    'x-init': function () {
      if (this.value === undefined)
        console.warn('"x-accordion:item" is missing a parent element with "x-accordion".')
    },
    'x-id': function () {
      return ['accordion']
    },
  })
}

function accordionTrigger(el: ElementWithXAttributes<HTMLElement>, Alpine: Alpine) {
  Alpine.bind(el, {
    'x-init': function () {
      if (this.value === undefined)
        console.warn('"x-accordion:trigger" is missing a parent element with "x-accordion".')
    },
    '@click': function () {
      return this.value.includes(this.$id('accordion'))
        ? this.remove(this.$id('accordion'))
        : this.add(this.$id('accordion'))
    },
    ':aria-controls': function () {
      return this.$id('accordion')
    },
    ':aria-expanded': function () {
      return this.value.includes(this.$id('accordion'))
    },
    '@keydown.prevent.down': function () {
      return this.$focus.within(this.rootEl).wrap().next()
    },
    '@keydown.prevent.up': function () {
      return this.$focus.within(this.rootEl).wrap().previous()
    },
    '@keydown.prevent.home': function () {
      return this.$focus.within(this.rootEl).first()
    },
    '@keydown.prevent.end': function () {
      return this.$focus.within(this.rootEl).last()
    },
  })
}

function accordionContent(el: ElementWithXAttributes<HTMLElement>, Alpine: Alpine) {
  Alpine.bind(el, {
    'x-init': function () {
      if (this.value === undefined)
        console.warn('"x-accordion:content" is missing a parent element with "x-accordion".')
    },
    ':id': function () {
      return this.$id('accordion')
    },
    ':hidden': function () {
      return this.value.includes(this.$id('accordion')) ? false : 'until-found'
    },
  })
}
