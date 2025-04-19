import { Modal } from './components/modal'

declare global {
  interface Window {
    Modal: typeof Modal
    modalInit: () => void
  }
}
