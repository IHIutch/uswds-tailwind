import { defineComponent } from "../../utils/define-component"

export default defineComponent(() => ({
  init() {
    this.multiple = this.$el.dataset.multiple !== undefined
  },
  multiple: false,
  value: [] as Array<string>,
  setValue(val: Array<string>) {
    this.value = val
  },
  add(val: string) {
    return this.multiple ? this.setValue([...this.value, val]) : this.setValue([val])
  },
  remove(val: string) {
    return this.setValue(this.value.filter((v: string) => v !== val))
  },

  accordion_item: {
    ['x-id']() {
      return ['accordion']
    },
  },

  accordion_trigger: {
    ['@click']() {
      return this.value.includes(this.$id('accordion'))
        ? this.remove(this.$id('accordion'))
        : this.add(this.$id('accordion'))
    },
    [':aria-controls']() {
      return this.$id('accordion')
    },
    [':aria-expanded']() {
      return this.value.includes(this.$id('accordion'))
    },
    ['@keydown.down']() {
      return this.$focus.within(this.$root).wrap().next()
    },
    ['@keydown.up']() {
      return this.$focus.within(this.$root).wrap().previous()
    },
    ['@keydown.home']() {
      return this.$focus.within(this.$root).first()
    },
    ['@keydown.end']() {
      return this.$focus.within(this.$root).last()
    },
  },

  accordion_content: {
    ['x-cloak']() {
      return true
    },
    [':id']() {
      return this.$id('accordion')
    },
    ['x-show']() {
      return this.value.includes(this.$id('accordion'))
    },
  }
}))
