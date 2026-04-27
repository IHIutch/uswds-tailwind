---
"@uswds-tailwind/react": patch
"@uswds-tailwind/compat": patch
"@uswds-tailwind/theme": patch
---

**Breaking for consumers:** `@uswds-tailwind/theme` is now a **peer dependency** of
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
