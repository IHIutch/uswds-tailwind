# USWDS + Tailwind

USWDS components for Tailwind CSS, available as React components or vanilla JS modules. Built on top of [zag-js](https://zagjs.com/) state machines for accessible, headless behavior.

![USWDS + Tailwind Logo](https://repository-images.githubusercontent.com/674037448/e36daf0e-292a-4143-8d9c-e54dd8935fe4)

> [!NOTE]
> This project is currently in **alpha**. APIs may change between releases.

## Documentation

Full guides, component API, and examples live at [uswds-tailwind.com](https://uswds-tailwind.com).

## Packages

| Package | Description |
|---|---|
| [`@uswds-tailwind/react`](./packages/react) | React component library |
| [`@uswds-tailwind/compat`](./packages/compat) | Drop-in vanilla JS modules |
| [`@uswds-tailwind/theme`](./packages/theme) | Tailwind v4 theme with USWDS design tokens |
| [`@uswds-tailwind/<name>-compat`](./packages/machines) | Headless zag-js state machines (one per component) |

## Repository structure

- `apps/docs/`: Astro documentation site at [uswds-tailwind.com](https://uswds-tailwind.com)
- `packages/react/`: React component library + Storybook
- `packages/compat/`: vanilla JS bundle
- `packages/theme/`: Tailwind v4 theme
- `packages/machines/`: per-component zag-js state machines
- `examples/`: minimal example projects

## Local development

Requires [Node.js](https://nodejs.org/) (see [`.nvmrc`](./.nvmrc)) and [pnpm](https://pnpm.io/).

```bash
git clone https://github.com/IHIutch/uswds-tailwind.git
cd uswds-tailwind
pnpm install
pnpm build:packages
```

Common scripts (run from the repo root):

| Script | What it does |
|---|---|
| `pnpm build:packages` | Build all publishable packages |
| `pnpm build:website` | Build the docs site |
| `pnpm lint` | Run ESLint across the monorepo |
| `pnpm lint:publish` | Run [publint](https://publint.dev) on every package |
| `pnpm typecheck` | Run TypeScript across packages |
| `pnpm test` | Run package tests |
| `pnpm --filter website dev` | Start the docs dev server |
| `pnpm --filter @uswds-tailwind/react storybook` | Start Storybook |

## Contributing

Contributions are welcome. See [CONTRIBUTING.md](./CONTRIBUTING.md) for branching, conventional commits, changesets, and PR conventions.

## Community

- [GitHub Issues](https://github.com/IHIutch/uswds-tailwind/issues) for bug reports and feature requests
- [GitHub Discussions](https://github.com/IHIutch/uswds-tailwind/discussions) for questions and ideas
- [Code of Conduct](./CODE_OF_CONDUCT.md)
- [Security policy](./SECURITY.md)

## License

[MIT](./LICENSE)
