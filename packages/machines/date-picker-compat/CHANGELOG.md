# @uswds-tailwind/date-picker-compat

## 0.3.0-alpha.3

### Patch Changes

- Simpler consumer install and CSS setup. Reverses the
  peer-dep split introduced in `alpha.2`.

  **Install (1 package):**

  ```json
  {
    "dependencies": {
      "@uswds-tailwind/react": "alpha"
    }
  }
  ```

  `@uswds-tailwind/theme` is now a regular dependency of `@uswds-tailwind/react`,
  so it installs transitively. Consumers no longer need to list it explicitly.

  **CSS (2 lines):**

  ```css
  @import "tailwindcss";
  @import "@uswds-tailwind/react";
  ```

  `@uswds-tailwind/react` now declares a `"style"` export condition that points
  at its bundled stylesheet. CSS bundlers (Vite + `@tailwindcss/vite`, Parcel,
  PostCSS with `@tailwindcss/postcss`) resolve `@import "@uswds-tailwind/react"`
  to that file automatically. The previous `@import "@uswds-tailwind/react/styles.css"`
  form still works.

  **Theme dependency cleanup:**
  - `tailwindcss` moved from `dependencies` → `peerDependencies` on
    `@uswds-tailwind/theme`. Consumers always have their own `tailwindcss` in
    their app build; pinning a copy inside theme risked installing a duplicate
    that wouldn't share the consumer's plugin registry.
  - The five `@fontsource-variable/*` and four `@iconify-json/*` /
    `@iconify/tailwind4` packages moved from `dependencies` → `optionalDependencies`.
    They install by default (no consumer-facing change), but can be opted out
    of with `pnpm install --no-optional` or `npm install --omit=optional` for
    consumers who want to provide their own fonts/icons.

  **Webpack note:** the `style` export condition needs `resolve.conditionNames:
['style', '...']` (or use `@tailwindcss/postcss`). Vite users get it for free.

## 0.3.0-alpha.2

## 0.3.0-alpha.1

## 0.3.0-alpha.0

## 0.2.0

## 0.1.0

### Minor Changes

- f1236e1: Basic working components with all USWDS tests passing
