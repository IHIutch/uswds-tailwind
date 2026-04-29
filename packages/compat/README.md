# @uswds-tailwind/compat

[![Open on npmx.dev](https://npmx.dev/api/registry/badge/version/@uswds-tailwind/compat)](https://npmx.dev/package/@uswds-tailwind/compat)
[![Open on npmx.dev](https://npmx.dev/api/registry/badge/license/@uswds-tailwind/compat)](https://npmx.dev/package/@uswds-tailwind/compat)
[![Open on npmx.dev](https://npmx.dev/api/registry/badge/types/@uswds-tailwind/compat)](https://npmx.dev/package/@uswds-tailwind/compat)

USWDS components as drop-in vanilla JavaScript modules. Auto-initializes elements with USWDS data attributes. No framework required.

> [!NOTE]
> This package is in **alpha**. APIs may change between releases. Pin exact versions and read the [changelog](https://github.com/IHIutch/uswds-tailwind/releases) before upgrading.

## Install

```bash
npm install @uswds-tailwind/compat@alpha
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
import { accordion } from '@uswds-tailwind/compat/accordion'

accordion.on(document.querySelector('.usa-accordion'))
```

## Components

`accordion`, `character-count`, `collapse`, `combobox`, `date-picker`, `date-range-picker`, `dropdown`, `file-input`, `input-mask`, `modal`, `table`, `tooltip`.

## Documentation

[uswds-tailwind.com](https://uswds-tailwind.com)

## License

[MIT](https://github.com/IHIutch/uswds-tailwind/blob/next/LICENSE)
