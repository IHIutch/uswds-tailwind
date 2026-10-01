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
- Shared route templates in `src/pages/components/react/[...slug].astro` and `src/pages/components/vanilla/[...slug].astro` render those documents through the common layout. Existing `/docs/{library}/components/{slug}` URLs continue to render the same content and remain canonical.
- React demos live in `src/examples/*.tsx` and contain only runnable examples. Import them directly into React MDX with `client:load`. `ReactPreview` derives the displayed source, filename, and StackBlitz files from the example name; it does not render documentation headings or prose.
- The internal component coverage map is `src/content/component-coverage.ts`; it validates documentation and examples and is not displayed on public pages. Run `pnpm --filter website exec astro check` and `pnpm build:website` after adding a page or example.

Use the package's public imports in copyable examples. Check the published release version before changing install instructions; the site name does not determine npm semver.

## Add a React example

Add the TSX demo under `src/examples/`, then include it in the matching React MDX document:

```mdx
import ReactPreview from '#components/react-preview.astro'
import ButtonDemo from '../../../examples/button-demo'

## Examples

<ReactPreview variant="Examples" example="button-demo">
  <ButtonDemo client:load />
</ReactPreview>
```

Mark the matching variant as React `covered` in `src/content/component-coverage.ts`. Write headings and explanatory text as ordinary Markdown outside `ReactPreview`. `variant` identifies the coverage entry; `title` can override the preview's visible title. Add `playgroundDependencies` when the demo needs another package. No per-component Astro template is needed.

Run `pnpm --filter website check:coverage`. It checks each covered variant has exactly one registration, its rendered island matches the source, and registrations refer to known pages, variants, and TSX files. It also runs regression tests for those failure cases. The website build runs this gate in CI.
