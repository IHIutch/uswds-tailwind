interface Destroyable { destroy: () => void }

export function createDisposableComponent<T>(
  template: string,
  initializer: () => Destroyable[] | void,
  getElements: () => T,
) {
  document.body.innerHTML = template
  // The test iframe starts unfocused, so real key presses (Tab) go to the outer runner page
  // until something inside is clicked. Focus it so keyboard tests don't depend on test order.
  window.focus()
  const instances = initializer() ?? []

  return {
    elements: getElements(),
    [Symbol.dispose]: () => {
      instances.forEach(instance => instance.destroy())
    },
    [Symbol.asyncDispose]: async () => {
      instances.forEach(instance => instance.destroy())
      await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))
    },
  }
}
