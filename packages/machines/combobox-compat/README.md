# @uswds-tailwind/combobox-compat

[![Open on npmx.dev](https://npmx.dev/api/registry/badge/version/@uswds-tailwind/combobox-compat)](https://npmx.dev/package/@uswds-tailwind/combobox-compat)
[![Open on npmx.dev](https://npmx.dev/api/registry/badge/license/@uswds-tailwind/combobox-compat)](https://npmx.dev/package/@uswds-tailwind/combobox-compat)

Headless [zag-js](https://zagjs.com/) state machine for the USWDS combobox component. Provides state and accessibility behavior used by `@uswds-tailwind/react` and `@uswds-tailwind/compat`.

> [!NOTE]
> This package is in **alpha**. APIs may change between releases.

## Install

```bash
npm install @uswds-tailwind/combobox-compat@alpha
```

## Usage

This is a low-level building block. Most consumers should reach for one of the higher-level packages instead:

- React: [`@uswds-tailwind/react`](https://npmx.dev/package/@uswds-tailwind/react)
- Vanilla JS: [`@uswds-tailwind/compat`](https://npmx.dev/package/@uswds-tailwind/compat)

If you need to wire the machine up to a different framework, see the [zag-js docs](https://zagjs.com/) for the framework-agnostic machine API.

## Custom filtering

`filter` is a regex template for matching option labels. The default,
`.*{{query}}.*`, finds the typed text anywhere in a label. Use `{{query}}.*`
to match only labels that start with the typed text.

To extract part of the input, declare a named placeholder and its capture regex
in `filterExtras`:

```ts
const props = {
  filter: 'Item {{number}}',
  filterExtras: { number: '(\\d+)' },
}
```

Typing `number 12` extracts `12` and matches the label `Item 12`.

| Placeholder | Source | Inserted text |
| --- | --- | --- |
| `{{query}}` | Full input | The complete typed text |
| `{{number}}` | `filterExtras.number` | The regex's first capture group |

Substituted text is escaped, so input cannot introduce regex operators. Matching
is case-insensitive and applies to the whole label. A named capture that does not
match inserts an empty string. Each capture regex must include a capture group.

The vanilla adapter uses `data-filter-*` attributes to declare captures on the combobox root:

```html
<div
  data-scope="combobox"
  data-part="root"
  data-filter="Item {{number}}"
  data-filter-number="(\d+)"
>
  <!-- Combobox parts -->
</div>
```

`data-filter-number` supplies `{{number}}`. For multiple words,
`data-filter-start-hour` supplies `{{startHour}}`.

USWDS's existing convention still works as a fallback: `data-number-filter`
supplies `{{numberFilter}}` through the root's dataset. An explicit `data-filter-*`
capture takes precedence when both forms supply the same placeholder. Passing
`filterExtras` directly to the adapter overrides all attribute-derived captures.
`{{query}}` always uses the full input, regardless of capture attributes.

`customFilter` is an internal hook for the time picker, not a public API. Use
`filter` and `filterExtras` for custom filtering. The internal callback overrides regex filtering
for nonempty input. Clearing the input, opening a pristine selection, or disabling
filtering keeps the normal full-list behavior.

## License

[MIT](./LICENSE)
