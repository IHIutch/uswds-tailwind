export function createDisposableComponent<T>(
  template: string,
  initializer: () => void,
  getElements: () => T,
) {
  document.body.innerHTML = template
  initializer()

  return {
    elements: getElements(),
    [Symbol.dispose]: () => { },
  }
}
