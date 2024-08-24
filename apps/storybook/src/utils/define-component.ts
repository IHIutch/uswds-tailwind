import { AlpineComponent } from "@alpinejs/csp";

export const defineComponent = <P, T>(fn: (params: P) => AlpineComponent<T>) => fn
