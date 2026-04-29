# @uswds-tailwind/react

[![Open on npmx.dev](https://npmx.dev/api/registry/badge/version/@uswds-tailwind/react)](https://npmx.dev/package/@uswds-tailwind/react)
[![Open on npmx.dev](https://npmx.dev/api/registry/badge/license/@uswds-tailwind/react)](https://npmx.dev/package/@uswds-tailwind/react)
[![Open on npmx.dev](https://npmx.dev/api/registry/badge/types/@uswds-tailwind/react)](https://npmx.dev/package/@uswds-tailwind/react)

USWDS components for React, styled with [Tailwind CSS](https://tailwindcss.com/) and powered by [zag-js](https://zagjs.com/) state machines.

> [!NOTE]
> This package is in **alpha**. APIs may change between releases. Pin exact versions and read the [changelog](https://github.com/IHIutch/uswds-tailwind/releases) before upgrading.

## Install

```bash
npm install @uswds-tailwind/react@alpha
```

You'll also need Tailwind CSS v4 and the theme package:

```bash
npm install -D tailwindcss @uswds-tailwind/theme@alpha
```

## Setup

Add two `@import` lines to your global CSS:

```css
@import 'tailwindcss';
@import '@uswds-tailwind/react/styles.css';
```

`styles.css` re-exports the theme tokens and registers `@source` globs for the component classes used internally, so consumers don't need to configure anything else.

## Usage

```tsx
import { Button } from '@uswds-tailwind/react/button'

export default function App() {
  return <Button>Get started</Button>
}
```

Each component is also accessible from a subpath import (e.g. `@uswds-tailwind/react/accordion`) so bundlers can tree-shake unused components.

## Documentation

Component API, props, and Storybook examples: [uswds-tailwind.com](https://uswds-tailwind.com)

## License

[MIT](./LICENSE)
