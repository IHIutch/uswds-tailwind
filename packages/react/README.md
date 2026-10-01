# @uswds-tailwind/react

[![Open on npmx.dev](https://npmx.dev/api/registry/badge/version/@uswds-tailwind/react)](https://npmx.dev/package/@uswds-tailwind/react)
[![Open on npmx.dev](https://npmx.dev/api/registry/badge/license/@uswds-tailwind/react)](https://npmx.dev/package/@uswds-tailwind/react)
[![Open on npmx.dev](https://npmx.dev/api/registry/badge/types/@uswds-tailwind/react)](https://npmx.dev/package/@uswds-tailwind/react)

USWDS components for React, styled with [Tailwind CSS](https://tailwindcss.com/) and powered by [zag-js](https://zagjs.com/) state machines.

> [!NOTE]
> This package is in **alpha**. APIs may change between releases.

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/edit/vitejs-vite-xm6mmahl)

## Install

```bash
npm install @uswds-tailwind/react@alpha react@^19 react-dom@^19 tailwindcss
```

## Setup

Add two `@import` lines to your global CSS:

```css
/* style.css */
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

Use a public component subpath, such as `@uswds-tailwind/react/accordion`, for component imports. The React stylesheet imports the theme and its fonts; there is no separate theme CSS import.

For setup in an existing React app, follow the [React getting-started guide](https://v2.uswds-tailwind.com/docs/react/getting-started).

## Documentation

Component API, props, and Storybook examples: [v2.uswds-tailwind.com](https://v2.uswds-tailwind.com)

## License

[MIT](./LICENSE)
