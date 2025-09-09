export function createDisposableComponent<T>(
  id: string,
  template: string,
  initializer: () => void,
  getElements: () => T,
) {
  document.body.innerHTML = template
  initializer()

  return {
    elements: getElements(),
    [Symbol.dispose]: () => { document.body.innerHTML = '' },
  }
}
