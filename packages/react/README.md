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
npm install @uswds-tailwind/react@alpha tailwindcss
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

Each component is also accessible from a subpath import (e.g. `@uswds-tailwind/react/accordion`) so bundlers can tree-shake unused components.

## Element IDs

Machine-backed roots such as Accordion, Combobox, Dropdown, InputMask, FileInput, and Tooltip follow Ark UI's ID convention. `id` is the machine identifier used to generate part IDs. If omitted, React generates an identifier.

Use `ids` to override exact DOM IDs. For example, `<Accordion.Root id="faq" ids={{ root: 'faq-root' }}>` renders a root with ID `faq-root`, while generated child IDs use the `faq` namespace. Without `ids.root`, its root ID is `accordion:faq`.

## Documentation

Component API, props, and Storybook examples: [uswds-tailwind.com](https://uswds-tailwind.com)

## License

[MIT](./LICENSE)
