# Contributing to uswds-tailwind

Thanks for your interest in contributing! This document covers how the project is laid out, how to set up locally, and how to land a change.

> [!IMPORTANT]
> Please be respectful and constructive in all interactions. We aim to maintain a welcoming environment for all contributors.
> [👉 Read the Code of Conduct](./CODE_OF_CONDUCT.md)

## Table of Contents

- [Project goals](#project-goals)
- [Architecture](#architecture)
- [Getting started](#getting-started)
- [Development workflow](#development-workflow)
- [Storybook](#storybook)
- [Testing](#testing)
- [Code style](#code-style)
  - [Naming conventions](#naming-conventions)
- [Submitting changes](#submitting-changes)
  - [Before submitting](#before-submitting)
  - [Pull request process](#pull-request-process)
  - [Conventional commits](#conventional-commits)
  - [Changesets](#changesets)
- [Using AI](#using-ai)
- [Questions](#questions)
- [License](#license)

## Project goals

`uswds-tailwind` provides a modern implementation of the [USWDS design system](https://designsystem.digital.gov/) on top of Tailwind CSS, with both vanilla JavaScript and React consumers driven by the same underlying state machines.

The aims are:

- **Behavioral parity with USWDS** for accessibility, keyboard interaction, and screen-reader announcements
- **Modern foundation** built on Tailwind v4 + zag-js state machines
- **Two consumer surfaces** sharing the same logic: a vanilla JS runtime (`@uswds-tailwind/compat`) and a React component library (`@uswds-tailwind/react`)

## Architecture

This is a pnpm + Turborepo monorepo. Three tiers, each in its own package layer:

1. **Machines** (`packages/machines/<name>-compat/`) hold all state and logic. Built with `@zag-js/core`. No DOM access in the machine itself.
2. **Connect** layer (in the same `*-compat` package) translates machine state into DOM-aware prop bags. Returns plain objects with `aria-*`, `data-*`, event handlers, etc.
3. **Consumers** spread those prop bags onto real elements:
   - `packages/compat/src/<name>.ts` — vanilla JS class wrapping each machine for browser-side initialization
   - `packages/react/src/<name>/` — React component using `@zag-js/react` to drive the machine

Published packages:

| Package | Purpose |
|---|---|
| `@uswds-tailwind/react` | React component library |
| `@uswds-tailwind/compat` | Vanilla JS wrappers / auto-init |
| `@uswds-tailwind/theme` | Tailwind config + base styles + fonts/icons |
| `@uswds-tailwind/*-compat` | Per-component machine + connect |

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS version recommended)
- [pnpm](https://pnpm.io/) v10 or later

### Setup

```bash
git clone https://github.com/IHIutch/uswds-tailwind.git
cd uswds-tailwind
pnpm install
pnpm build:packages
```

> [!NOTE]
> Always run `pnpm build:packages` after `pnpm install` so workspace packages have their compiled `dist/` output. Without this, sibling packages will fail to resolve types and runtime entries.

If you hit module resolution errors like `Cannot find module '@uswds-tailwind/...'`, run `pnpm rebuild` to bypass the Turbo cache.

## Development workflow

| Command | What it does |
|---|---|
| `pnpm build:packages` | Build all packages under `packages/*/*` |
| `pnpm lint` | Run ESLint across the workspace |
| `pnpm typecheck` | Run `tsc --noEmit` across all packages |
| `pnpm test` | Run Vitest in browser mode |
| `pnpm changeset` | Create a changeset for a user-facing change |

Per-package commands run via pnpm filters:

```bash
# Build just one package
pnpm --filter @uswds-tailwind/react build

# Run Storybook for the React package
pnpm --filter @uswds-tailwind/react storybook

# Type-check just one package
pnpm --filter @uswds-tailwind/combobox-compat typecheck
```

## Storybook

The React package ships a Storybook covering every component with multiple variants. To work on it:

```bash
pnpm --filter @uswds-tailwind/react storybook
```

Stories live alongside their components at `packages/react/src/<name>/<name>.stories.tsx`. When adding a new component or variant, please include a story so reviewers can interact with it.

## Testing

Tests run in real browsers via Vitest's browser mode (Playwright + Chromium):

```bash
pnpm test
```

Per-package:

```bash
pnpm --filter @uswds-tailwind/react test
```

When adding behavior, please add or extend tests. Behavioral parity tests for USWDS-equivalent behavior live as `*.legacy.test.tsx` next to the component they cover.

## Code style

The repo uses the [`@antfu/eslint-config`](https://github.com/antfu/eslint-config) preset. Lint runs in CI; please run `pnpm lint` before opening a PR.

TypeScript settings live in each package's `tsconfig.json`, extending shared base config.

### Naming conventions

| Type | Convention | Example |
|---|---|---|
| React components | PascalCase | `Accordion`, `DatePicker` |
| Component files | kebab-case | `accordion.tsx`, `date-picker.tsx` |
| Hooks | camelCase + `use` prefix | `useCharacterCount` in `use-character-count.ts` |
| Stories | `<name>.stories.tsx` | `accordion.stories.tsx` |
| Tests | `<name>.test.tsx` | `accordion.test.tsx`, `accordion.legacy.test.tsx` |
| Machine files | `<name>.<role>.ts` | `accordion.machine.ts`, `accordion.connect.ts`, `accordion.dom.ts`, `accordion.anatomy.ts`, `accordion.props.ts`, `accordion.types.ts` |
| Functions | camelCase | `parseDateString`, `formatDate` |
| Constants | UPPER_SNAKE_CASE | `INTERNAL_DATE_FORMAT`, `YEAR_CHUNK` |
| Types/Interfaces | PascalCase | `ComboboxApi`, `DatepickerSchema`, `AccordionRootProps` |

## Submitting changes

### Before submitting

1. ensure your code follows the style guidelines
2. run linting: `pnpm lint`
3. run type checking: `pnpm typecheck`
4. run tests: `pnpm test`
5. write or update tests for your changes
6. add a [changeset](#changesets) if your change affects a published package

### Pull request process

1. create a feature branch from `next`
2. make your changes with clear, descriptive commits
3. push your branch and open a pull request
4. fill out the PR template (linked issue, context, description, changeset, test plan)
5. ensure CI checks pass (lint, type check, build, tests, semantic-pr-title)
6. request review from maintainers

### Conventional commits

We use [Conventional Commits](https://www.conventionalcommits.org/) for PR titles. Since we squash on merge, the PR title becomes the commit message on `next`, so the title matters more than individual commit messages within the PR.

Format: `type(scope): description`

**Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`

**Scopes (optional):** `a11y`, `deps`, `docs`, `machine`, `react`, `vanilla`, etc.

**Examples:**

- `fix(machine): clear combobox input when value is reset`
- `feat(react): add Card component`
- `chore(deps): update zag-js to 1.41`
- `docs: clarify theme install instructions`

PR titles are checked automatically by the `Semantic Pull Request` workflow on every PR.

### Changesets

This repo uses [Changesets](https://github.com/changesets/changesets) to automate releases. If your PR should release a new package version (patch, minor, or major), please run `pnpm changeset` and commit the file. If your PR affects docs, examples, styles, etc., you probably don't need to generate a changeset.

## Using AI

You're welcome to use AI tools to help you contribute. But there are two important ground rules:

### 1. Never let an LLM speak for you

When you write a comment, issue, or PR description, use your own words. Grammar and spelling don't matter &ndash; real connection does. AI-generated summaries tend to be long-winded, dense, and often inaccurate. Simplicity is an art. The goal is not to sound impressive, but to communicate clearly.

### 2. Never let an LLM think for you

Feel free to use AI to write code, tests, or point you in the right direction. But always understand what it's written before contributing it. Take personal responsibility for your contributions. Don't say "ChatGPT says..." &ndash; tell us what _you_ think.

## Questions

For general questions, design discussions, or "is this a bug?" triage:

👉 [Open a Discussion](https://github.com/IHIutch/uswds-tailwind/discussions)

For confirmed bugs and concrete feature requests, use the [issue tracker](https://github.com/IHIutch/uswds-tailwind/issues/new/choose).

## License

By contributing to uswds-tailwind, you agree that your contributions will be licensed under the project's [LICENSE](./LICENSE).
