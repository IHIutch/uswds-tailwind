# Documentation site

The Astro site in this workspace publishes the Vanilla and React guides, component pages, live previews, and StackBlitz projects.

## Run locally

From the repository root, install dependencies with `pnpm install`, then run:

```sh
pnpm build:packages
pnpm --filter website dev
```

For a production build and content/type checks:

```sh
pnpm --filter website exec astro check
pnpm build:website
```

## Edit content

- Shared pages live in `src/content/pages/`. `getting-started.mdx` is the Vanilla guide; `getting-started-react.mdx` is the React guide. `src/components/docs-getting-started-page.astro` selects the page using the library route.
- Component prose lives in `src/content/components/`. Keep shared descriptions and accessibility advice together; use the existing library routes for library-specific examples.
- Live demos and their source are registered in `src/components/docs-component-page.astro` and stored under `src/examples/`. Keep the visible preview, copied source, and StackBlitz export aligned.
- The component availability map is `src/content/component-coverage.ts`. Run `pnpm --filter website exec astro check` and `pnpm build:website` after adding a page or example.

Use the package's public imports in copyable examples. Check the published release version before changing install instructions; the site name does not determine npm semver.
