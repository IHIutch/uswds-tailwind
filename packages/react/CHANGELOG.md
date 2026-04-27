# @uswds-tailwind/react

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
