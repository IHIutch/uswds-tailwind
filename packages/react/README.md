# @uswds-tailwind/react

[![Open on npmx.dev](https://npmx.dev/api/registry/badge/version/@uswds-tailwind/react)](https://npmx.dev/package/@uswds-tailwind/react)
[![Open on npmx.dev](https://npmx.dev/api/registry/badge/license/@uswds-tailwind/react)](https://npmx.dev/package/@uswds-tailwind/react)
[![Open on npmx.dev](https://npmx.dev/api/registry/badge/types/@uswds-tailwind/react)](https://npmx.dev/package/@uswds-tailwind/react)

USWDS components for React, styled with [Tailwind CSS](https://tailwindcss.com/) and powered by [zag-js](https://zagjs.com/) state machines.

> [!NOTE]
> This package is in **alpha**. APIs may change between releases.

## Install

```bash
npm install @uswds-tailwind/react@alpha tailwindcss
```

## Setup

Add two `@import` lines to your global CSS:

```css
@import 'tailwindcss';
@import '@uswds-tailwind/react';
```

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
