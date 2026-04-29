# @uswds-tailwind/react

## 0.3.0-alpha.6

### Patch Changes

- 2a7b7b2: Fix release pipeline: `build:packages` now matches all packages (filter was missing one-segment-deep paths, so `react`, `compat`, `theme` shipped without `dist/`). Publish step now passes `--tag alpha` so prereleases stop hijacking the `latest` dist-tag.
- Updated dependencies [2a7b7b2]
  - @uswds-tailwind/character-count-compat@0.3.0-alpha.6
  - @uswds-tailwind/date-picker-compat@0.3.0-alpha.6
  - @uswds-tailwind/file-input-compat@0.3.0-alpha.6
  - @uswds-tailwind/input-mask-compat@0.3.0-alpha.6
  - @uswds-tailwind/accordion-compat@0.3.0-alpha.6
  - @uswds-tailwind/collapse-compat@0.3.0-alpha.6
  - @uswds-tailwind/combobox-compat@0.3.0-alpha.6
  - @uswds-tailwind/dropdown-compat@0.3.0-alpha.6
  - @uswds-tailwind/tooltip-compat@0.3.0-alpha.6
  - @uswds-tailwind/modal-compat@0.3.0-alpha.6
  - @uswds-tailwind/table-compat@0.3.0-alpha.6
  - @uswds-tailwind/theme@0.3.0-alpha.6

## 0.3.0-alpha.5

### Patch Changes

- 65ce7ca: CI tweaks and readme updates
- Updated dependencies [65ce7ca]
  - @uswds-tailwind/character-count-compat@0.3.0-alpha.5
  - @uswds-tailwind/date-picker-compat@0.3.0-alpha.5
  - @uswds-tailwind/file-input-compat@0.3.0-alpha.5
  - @uswds-tailwind/input-mask-compat@0.3.0-alpha.5
  - @uswds-tailwind/accordion-compat@0.3.0-alpha.5
  - @uswds-tailwind/collapse-compat@0.3.0-alpha.5
  - @uswds-tailwind/combobox-compat@0.3.0-alpha.5
  - @uswds-tailwind/dropdown-compat@0.3.0-alpha.5
  - @uswds-tailwind/tooltip-compat@0.3.0-alpha.5
  - @uswds-tailwind/modal-compat@0.3.0-alpha.5
  - @uswds-tailwind/table-compat@0.3.0-alpha.5
  - @uswds-tailwind/theme@0.3.0-alpha.5

## 0.3.0-alpha.4

### Patch Changes

- dd6574d: Add package readmes
- Updated dependencies [dd6574d]
  - @uswds-tailwind/character-count-compat@0.3.0-alpha.4
  - @uswds-tailwind/date-picker-compat@0.3.0-alpha.4
  - @uswds-tailwind/file-input-compat@0.3.0-alpha.4
  - @uswds-tailwind/input-mask-compat@0.3.0-alpha.4
  - @uswds-tailwind/accordion-compat@0.3.0-alpha.4
  - @uswds-tailwind/collapse-compat@0.3.0-alpha.4
  - @uswds-tailwind/combobox-compat@0.3.0-alpha.4
  - @uswds-tailwind/dropdown-compat@0.3.0-alpha.4
  - @uswds-tailwind/tooltip-compat@0.3.0-alpha.4
  - @uswds-tailwind/modal-compat@0.3.0-alpha.4
  - @uswds-tailwind/table-compat@0.3.0-alpha.4
  - @uswds-tailwind/theme@0.3.0-alpha.4

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

- Updated dependencies
  - @uswds-tailwind/accordion-compat@0.3.0-alpha.3
  - @uswds-tailwind/character-count-compat@0.3.0-alpha.3
  - @uswds-tailwind/collapse-compat@0.3.0-alpha.3
  - @uswds-tailwind/combobox-compat@0.3.0-alpha.3
  - @uswds-tailwind/date-picker-compat@0.3.0-alpha.3
  - @uswds-tailwind/dropdown-compat@0.3.0-alpha.3
  - @uswds-tailwind/file-input-compat@0.3.0-alpha.3
  - @uswds-tailwind/input-mask-compat@0.3.0-alpha.3
  - @uswds-tailwind/modal-compat@0.3.0-alpha.3
  - @uswds-tailwind/table-compat@0.3.0-alpha.3
  - @uswds-tailwind/theme@0.3.0-alpha.3
  - @uswds-tailwind/tooltip-compat@0.3.0-alpha.3

## 0.3.0-alpha.2

### Patch Changes

- 78f422a: **Breaking for consumers:** `@uswds-tailwind/theme` is now a **peer dependency** of
  `@uswds-tailwind/react`, not a transitive dependency. Consumers must now list
  both packages explicitly:

  ```json
  {
    "dependencies": {
      "@uswds-tailwind/react": "alpha",
      "@uswds-tailwind/theme": "alpha"
    }
  }
  ```

  This gives consumers direct control over the theme version and makes the
  dependency chain visible. The CSS import story is unchanged:

  ```css
  @import "tailwindcss";
  @import "@uswds-tailwind/react/styles.css";
  ```

  **Fixes:**
  - `@uswds-tailwind/combobox-compat` was missing `@zag-js/utils` in its
    `dependencies`, causing Rollup-based builds (Storybook, Vite production
    builds in some layouts) to fail with "Cannot resolve import '@zag-js/utils'".
    Now declared correctly.

- Updated dependencies [78f422a]
  - @uswds-tailwind/theme@0.3.0-alpha.2
  - @uswds-tailwind/accordion-compat@0.3.0-alpha.2
  - @uswds-tailwind/character-count-compat@0.3.0-alpha.2
  - @uswds-tailwind/collapse-compat@0.3.0-alpha.2
  - @uswds-tailwind/combobox-compat@0.3.0-alpha.2
  - @uswds-tailwind/date-picker-compat@0.3.0-alpha.2
  - @uswds-tailwind/dropdown-compat@0.3.0-alpha.2
  - @uswds-tailwind/file-input-compat@0.3.0-alpha.2
  - @uswds-tailwind/input-mask-compat@0.3.0-alpha.2
  - @uswds-tailwind/modal-compat@0.3.0-alpha.2
  - @uswds-tailwind/table-compat@0.3.0-alpha.2
  - @uswds-tailwind/tooltip-compat@0.3.0-alpha.2

## 0.3.0-alpha.1

### Patch Changes

- 0290ac1: Per-component subpath imports and bundled fonts/icons.
  - `@uswds-tailwind/react` now emits a per-component entry for each component
    directory, so `import { Button } from '@uswds-tailwind/react/button'` works
    alongside the root barrel import. `sideEffects` is configured so bundlers
    can tree-shake unused components.
  - `@uswds-tailwind/react/styles.css` is the single stylesheet consumers
    import. It pulls in `@uswds-tailwind/theme` and registers its own `@source`
    directive so Tailwind v4 picks up component classes without any path
    juggling on the consumer side.
  - `@uswds-tailwind/theme` now owns the font & iconify dependencies. The
    five USWDS variable fonts are `@import`'d automatically, and the
    `@iconify-json/*` data packages install with the theme so icon utility
    classes render out of the box.

  Consumer install is two lines:

  ```css
  @import "tailwindcss";
  @import "@uswds-tailwind/react/styles.css";
  ```

  Apply `font-source-sans` (or `font-public-sans`, etc.) on elements where
  USWDS typography should take effect.

- Updated dependencies [0290ac1]
  - @uswds-tailwind/theme@0.3.0-alpha.1
  - @uswds-tailwind/accordion-compat@0.3.0-alpha.1
  - @uswds-tailwind/character-count-compat@0.3.0-alpha.1
  - @uswds-tailwind/collapse-compat@0.3.0-alpha.1
  - @uswds-tailwind/combobox-compat@0.3.0-alpha.1
  - @uswds-tailwind/date-picker-compat@0.3.0-alpha.1
  - @uswds-tailwind/dropdown-compat@0.3.0-alpha.1
  - @uswds-tailwind/file-input-compat@0.3.0-alpha.1
  - @uswds-tailwind/input-mask-compat@0.3.0-alpha.1
  - @uswds-tailwind/modal-compat@0.3.0-alpha.1
  - @uswds-tailwind/table-compat@0.3.0-alpha.1
  - @uswds-tailwind/tooltip-compat@0.3.0-alpha.1

## 0.3.0-alpha.0

### Minor Changes

- 31de347: First public alpha of the USWDS + Tailwind component system. The
  `@uswds-tailwind/react` package ships React components matching USWDS
  behavior via Zag-based state machines, with parity tests mirroring
  USWDS's own legacy JS. The `@uswds-tailwind/compat` package provides a
  vanilla-JS bridge for progressive enhancement of existing USWDS markup.
  `@uswds-tailwind/theme` bundles the Tailwind config + design tokens.

  Alpha quality: APIs may change based on consumer feedback. Expect
  per-prop renames, compound-part ergonomics polish, and small fixes
  between `-alpha.N` releases.

### Patch Changes

- Updated dependencies [31de347]
  - @uswds-tailwind/theme@0.3.0-alpha.0
  - @uswds-tailwind/accordion-compat@0.3.0-alpha.0
  - @uswds-tailwind/character-count-compat@0.3.0-alpha.0
  - @uswds-tailwind/collapse-compat@0.3.0-alpha.0
  - @uswds-tailwind/combobox-compat@0.3.0-alpha.0
  - @uswds-tailwind/date-picker-compat@0.3.0-alpha.0
  - @uswds-tailwind/dropdown-compat@0.3.0-alpha.0
  - @uswds-tailwind/file-input-compat@0.3.0-alpha.0
  - @uswds-tailwind/input-mask-compat@0.3.0-alpha.0
  - @uswds-tailwind/modal-compat@0.3.0-alpha.0
  - @uswds-tailwind/table-compat@0.3.0-alpha.0
  - @uswds-tailwind/tooltip-compat@0.3.0-alpha.0
