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

Import the auto entry once. It scans the document on `DOMContentLoaded`, or immediately if the document is already ready:

```js
import '@uswds-tailwind/compat/auto'
```

For manual control, import `initAll` from `@uswds-tailwind/compat` and call it after the markup exists. Do not combine auto and manual initialization on the same elements. These scans do not observe later DOM insertions, and not every wrapper deduplicates repeated initialization.

### Initialize specific components

```js
import { accordionInit } from '@uswds-tailwind/compat/accordion'

// Run once after the accordion markup is in the document.
accordionInit()
```

Accordion markup uses `data-scope="accordion" data-part="root"`, then `data-part="item"`, `data-part="item-trigger"`, and `data-part="item-content"`. Each item needs a unique `data-value`. CSS classes supply presentation; they are not initialization selectors.

### Own an instance

```js
import { Accordion } from '@uswds-tailwind/compat/accordion'

const root = document.querySelector('#questions')
if (!root) throw new Error('Accordion root is missing')
const accordion = Accordion.getOrCreateInstance(root, { id: 'questions' })
await accordion.open('eligibility')

// Before removing the component:
accordion.destroy()
```

Retain the element reference because rendering can change its ID. `getInstance` accepts an element or CSS selector, `getOrCreateInstance` reuses an existing instance without reapplying options, and `destroy` stops it without restoring the original HTML. Accordion, Collapse, Dropdown, Input Mask, Modal, and Tooltip share this factory API; other wrappers still have legacy lifecycle differences. See the [JavaScript reference](https://uswds-tailwind.com/javascript#instance-lifecycle).

## Components

`accordion`, `character-count`, `collapse`, `combobox`, `date-picker`, `date-range-picker`, `dropdown`, `file-input`, `input-mask`, `modal`, `table`, `tooltip`.

The [Vanilla getting-started guide](https://uswds-tailwind.com/docs/vanilla/getting-started) shows how to use these packages in a plain HTML project. Use either the auto import or selective initialization for a component, not both.

## Documentation

[uswds-tailwind.com](https://uswds-tailwind.com)

## License

[MIT](./LICENSE)
