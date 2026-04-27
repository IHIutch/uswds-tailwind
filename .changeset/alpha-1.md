---
"@uswds-tailwind/react": patch
"@uswds-tailwind/compat": patch
"@uswds-tailwind/theme": patch
---

Per-component subpath imports and bundled fonts/icons.

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
