import { defineComponent } from "../../utils/define-component"

export default defineComponent(() => ({
  get maskValue() {
    return this.maskPlaceholder.split('').map((val, idx) => this.inputValue[idx] ? '' : val).join('')
  },
  inputValue: '',
  maskPlaceholder: '',
  input_mask_input: {
    ['x-init']() {
      if (this.$el.placeholder) {
        this.maskPlaceholder = this.$el.placeholder
        this.$el.dataset.placeholder = this.$el.placeholder
        this.$el.removeAttribute('placeholder')
      }
      return
    },
    ['@input']() {
      return this.$nextTick(() => {
        this.inputValue = this.$el.value
      })
    },
  }
}))
