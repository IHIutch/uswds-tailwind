---
"@uswds-tailwind/accordion-compat": patch
"@uswds-tailwind/character-count-compat": patch
"@uswds-tailwind/collapse-compat": patch
"@uswds-tailwind/combobox-compat": patch
"@uswds-tailwind/compat": patch
"@uswds-tailwind/date-picker-compat": patch
"@uswds-tailwind/dropdown-compat": patch
"@uswds-tailwind/file-input-compat": patch
"@uswds-tailwind/input-mask-compat": patch
"@uswds-tailwind/modal": patch
"@uswds-tailwind/modal-compat": patch
"@uswds-tailwind/react": patch
"@uswds-tailwind/table-compat": patch
"@uswds-tailwind/theme": patch
"@uswds-tailwind/tooltip-compat": patch
---

Simpler consumer install and CSS setup. Reverses the
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
