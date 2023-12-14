import { defineComponent } from "../../utils/define-component";

export default defineComponent(() => ({
  isOpen: false,
  modalId: '',
  modalTitleId: '',
  modalDescId: '',
  init() {
    this.modalId = this.$id('modal')
    this.modalTitleId = this.$id('modal-title')
    this.modalDescId = this.$id('modal-description')
  },
  isDismissable: true,

  modal_button: {
    ['@click']() {
      return this.isOpen = true
    },
    [':aria-controls']() {
      return this.modalId
    }
  },

  modal_title: {
    [':id']() {
      return this.modalTitleId
    }
  },

  modal_description: {
    [':id']() {
      return this.modalDescId
    }
  },

  modal_container: {
    ['x-init']() {
      return this.isDismissable = !this.$el.hasAttribute('data-force-action')
    },
    ['x-trap.noscroll.inert']() {
      return this.isOpen
    },
    [':id']() {
      return this.modalId
    },
    [':aria-labelledby']() {
      return this.modalTitleId
    },
    [':aria-describedby']() {
      return this.modalDescId
    },
    [':aria-modal']() {
      return true
    },
    ['x-show']() {
      return this.isOpen
    },
    ['@keydown.escape.prevent.stop']() {
      this.isOpen = this.isDismissable ? false : true
    },
    ['x-transition.opacity']() {
      return true
    },
    ['x-transition:leave.duration.0ms']() {
      return true
    },
  },

  modal_backdrop: {
    ['x-show']() {
      return this.isOpen
    },
    ['@click.stop.prevent']() {
      return this.isOpen = this.isDismissable ? false : true
    },
    ['x-transition.opacity']() {
      return true
    },
    ['x-transition:leave.duration.0ms']() {
      return true
    },
  },

  modal_content: {
    ['@click.outside']() {
      return this.isOpen = this.isDismissable ? false : true
    },
  }
}))
