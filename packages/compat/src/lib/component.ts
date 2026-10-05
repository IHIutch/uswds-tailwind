import type { AnatomyPart } from '@zag-js/anatomy'
import type { VanillaMachine } from '@zag-js/vanilla'
import { getRoots } from './dom'

interface ComponentInterface<Api> {
  rootEl: HTMLElement
  machine: VanillaMachine<any>
  api: Api

  init: () => Component<any, Api>
  destroy: () => void
  render: () => void
}

// One instance per element, regardless of component type. Entries are
// collected automatically with their element even without an explicit
// `destroy()` call.
const instances = new WeakMap<Element, Component<any, any>>()
const activeComponents = new Set<Component<any, any>>()

export function destroyAllComponents() {
  for (const component of [...activeComponents])
    component.destroy()
}

function resolve(target: Element | string | null): HTMLElement | null {
  const el = typeof target === 'string' ? document.querySelector(target) : target
  return el as HTMLElement | null
}

/**
 * Base class for components: binds a zag machine to a root element and
 * re-renders on updates. Instances are tracked in a WeakMap keyed by
 * element, backing `getInstance`/`getOrCreateInstance`/`createAll`.
 */
export abstract class Component<Props, Api> implements ComponentInterface<Api> {
  /**
   * The root entry of the machine package's `anatomy.build()`. Set per subclass. Drives
   * `createAll`'s root discovery.
   */
  static root?: AnatomyPart

  rootEl: HTMLElement
  machine: VanillaMachine<any>
  api: Api

  get doc(): Document {
    return this.rootEl.ownerDocument
  }

  constructor(target: Element | string | null, props: Props) {
    const el = resolve(target)
    if (!el)
      throw new Error('Root element not found')

    const existing = instances.get(el)
    if (existing) {
      throw new Error(
        `[compat] <${el.tagName.toLowerCase()}> is already bound to `
        + `${existing.constructor.name}; refusing to also bind ${this.constructor.name}.`,
      )
    }

    this.rootEl = el
    this.machine = this.initMachine(props)
    this.api = this.initApi()
    instances.set(el, this)
  }

  abstract initMachine(props: Props): VanillaMachine<any>
  abstract initApi(): Api

  init() {
    activeComponents.add(this)
    this.render()
    this.machine.subscribe(() => {
      this.api = this.initApi()
      this.render()
    })
    this.machine.start()
    return this
  }

  destroy() {
    try {
      this.machine.stop()
    }
    finally {
      activeComponents.delete(this)
      const legacyInstances = (this.constructor as { instances?: Map<string, Component<Props, Api>> }).instances
      const id = this.machine.service.scope.id
      if (id && legacyInstances?.get(id) === this)
        legacyInstances.delete(id)
      if (instances.get(this.rootEl) === this)
        instances.delete(this.rootEl)
    }
  }

  abstract render(): void

  /**
   * Awaits the machine's queued `send()` update and re-render. Public
   * mutators (`open`, `close`, `enable`, ...) should `await` this so
   * `this.rootEl` reflects the new state once the method resolves.
   */
  protected async settle(): Promise<void> {
    // Zag queues the machine update and subscriber notification in separate
    // microtasks. Wait for both, matching its vanilla tests' tick() helper.
    await Promise.resolve()
    await Promise.resolve()
  }

  /** The instance bound to `target`, or null if none (or a different component type). */
  static getInstance<T extends Component<any, any>>(
    this: new (target: Element | string | null, props: any) => T,
    target: Element | string | null,
  ): T | null {
    const el = resolve(target)
    const inst = el ? instances.get(el) : undefined
    return inst instanceof this ? inst : null
  }

  /** The instance bound to `target`, building + initializing one if absent. */
  static getOrCreateInstance<T extends Component<any, any>>(
    this: (new (target: Element | string | null, props: any) => T) & {
      getInstance: (target: Element | string | null) => T | null
    },
    target: Element | string | null,
    props: any = {},
  ): T {
    return this.getInstance(target) ?? new this(target, props).init() as T
  }

  /** Bind every element matching the subclass's `root` anatomy part within `scope`. */
  static createAll<T extends Component<any, any>>(
    this: (new (target: Element | string | null, props: any) => T) & {
      root: AnatomyPart
      getOrCreateInstance: (target: Element, props?: any) => T
    },
    scope: Document | Element = document,
  ): T[] {
    return getRoots<HTMLElement>(scope, this.root).map(el => this.getOrCreateInstance(el))
  }
}
