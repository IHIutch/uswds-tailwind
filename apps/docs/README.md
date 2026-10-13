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
- Component documentation lives in `src/content/components/react/` and `src/content/components/vanilla/`. Each component has one MDX document per library; MDX owns the headings, prose, and preview placement.
- `src/pages/docs/[library]/components/[...slug].astro` renders component documents through the common layout at `/docs/{library}/components/{slug}`. Getting started and JavaScript guides use the same library-specific route structure.
- React demos live in `src/examples/*.tsx` and contain only runnable examples. Import them directly into React MDX with `client:load`. `ReactPreview` derives the displayed source, filename, and StackBlitz files from the example name; it does not render documentation headings or prose.

Use the package's public imports in copyable examples. Check the published release version before changing install instructions; the site name does not determine npm semver.

## Add a React example

Add the TSX demo under `src/examples/`, then include it in the matching React MDX document:

```mdx
import ReactPreview from '#components/react-preview.astro'
import ButtonDemo from '../../../examples/button-demo'

## Examples

<ReactPreview title="Examples" example="button-demo">
  <ButtonDemo client:load />
</ReactPreview>
```

Write headings and explanatory text as ordinary Markdown outside `ReactPreview`. `title` sets the preview title. Add `playgroundDependencies` when the demo needs another package. No per-component Astro template is needed.

Run `pnpm --filter website exec astro check` and `pnpm build:website` after adding a page or example.
