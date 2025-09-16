import { initAll } from './init-all'

export * from './index'

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => initAll())
  }
  else {
    initAll()
  }
}
