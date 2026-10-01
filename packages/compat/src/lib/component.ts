import type { VanillaMachine } from '@zag-js/vanilla'

interface ComponentInterface<Api> {
  rootEl: HTMLElement
  machine: VanillaMachine<any>
  api: Api

  init: () => void
  destroy: () => void
  render: () => void
}

const activeComponents = new Set<Component<any, any>>()

export function destroyAllComponents() {
  for (const component of [...activeComponents])
    component.destroy()
}

export abstract class Component<Props, Api> implements ComponentInterface<Api> {
  rootEl: HTMLElement
  machine: VanillaMachine<any>
  api: Api

  get doc(): Document {
    return this.rootEl.ownerDocument
  }

  constructor(rootEl: HTMLElement | null, props: Props) {
    if (!rootEl)
      throw new Error('Root element not found')
    this.rootEl = rootEl
    this.machine = this.initMachine(props)
    this.api = this.initApi()
  }

  abstract initMachine(props: Props): VanillaMachine<any>
  abstract initApi(): Api

  init = () => {
    activeComponents.add(this)
    this.render()
    this.machine.subscribe(() => {
      this.api = this.initApi()
      this.render()
    })
    this.machine.start()
  }

  destroy = () => {
    this.machine.stop()
    activeComponents.delete(this)
    const instances = (this.constructor as { instances?: Map<string, Component<Props, Api>> }).instances
    const id = this.machine.service.scope.id
    if (id && instances?.get(id) === this)
      instances.delete(id)
  }

  abstract render(): void
}
