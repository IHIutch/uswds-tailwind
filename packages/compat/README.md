# @uswds-tailwind/compat

[![Open on npmx.dev](https://npmx.dev/api/registry/badge/version/@uswds-tailwind/compat)](https://npmx.dev/package/@uswds-tailwind/compat)
[![Open on npmx.dev](https://npmx.dev/api/registry/badge/license/@uswds-tailwind/compat)](https://npmx.dev/package/@uswds-tailwind/compat)
[![Open on npmx.dev](https://npmx.dev/api/registry/badge/types/@uswds-tailwind/compat)](https://npmx.dev/package/@uswds-tailwind/compat)

USWDS components as drop-in vanilla JavaScript modules. Auto-initializes elements with USWDS data attributes. No framework required.

> [!NOTE]
> This package is in **alpha**. APIs may change between releases.

## Install

```bash
npm install @uswds-tailwind/compat@alpha @uswds-tailwind/theme@alpha tailwindcss
```

## Usage

### Auto-initialize all components

Import once at the top of your entry file. Every supported USWDS component on the page is wired up automatically:

```js
import '@uswds-tailwind/compat/auto'
```

### Initialize specific components

If you'd rather opt in to individual components:

```js
import { accordionInit } from '@uswds-tailwind/compat/accordion'

// Run once after the accordion markup is in the document.
accordionInit()
```

## Components

`accordion`, `character-count`, `collapse`, `combobox`, `date-picker`, `date-range-picker`, `dropdown`, `file-input`, `input-mask`, `modal`, `table`, `tooltip`.

The [Vanilla getting-started guide](https://uswds-tailwind.com/docs/vanilla/getting-started) shows how to use these packages in a plain HTML project. Use either the auto import or selective initialization for a component, not both.

## Documentation

[uswds-tailwind.com](https://uswds-tailwind.com)

## License

[MIT](./LICENSE)
