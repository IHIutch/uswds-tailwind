# Starter templates

These standalone Vite projects follow [Vite's community-template workflow](https://vite.dev/guide/#community-templates). [tiged](https://github.com/tiged/tiged#specify-a-subdirectory) copies one directory without the repository's Git history.

| Template | Includes |
| --- | --- |
| [react-ts](./react-ts) | React, TypeScript, Tailwind CSS v4, and USWDS + Tailwind React components |
| [vanilla-ts](./vanilla-ts) | HTML, TypeScript, Tailwind CSS v4, and USWDS + Tailwind vanilla auto-init |

## Create a project

Use Node.js 22.12.0 or later. Choose a template:

```bash
npx tiged IHIutch/uswds-tailwind/templates/react-ts my-project
```

Or:

```bash
npx tiged IHIutch/uswds-tailwind/templates/vanilla-ts my-project
```

Then install and start the development server:

```bash
cd my-project
npm install
npm run dev
```

Run `npm run build` to typecheck and generate `dist/`. Use `npm run preview` to serve that build locally.

The templates install USWDS + Tailwind packages using the npm `latest` tag. This currently selects the v2 beta packages. APIs may change between releases. Fresh installs pick up new releases; an existing project's lockfile keeps its resolved versions until you update its dependencies.

To copy a particular branch or tag, append a ref to the template path, for example `IHIutch/uswds-tailwind/templates/react-ts#next`.

## Maintain the templates

Keep each template self-contained. Do not use `workspace:` or `catalog:` dependencies, shared TypeScript configs, or scripts outside its directory. The templates are outside the pnpm workspace so installs use published packages, as they do for users.

After changing dependencies, copy each template outside the repository, run `npm install`, and run `npm run build`. The projects in `examples/` also use published USWDS + Tailwind packages.
