# @uswds-tailwind/date-picker-compat

[![Open on npmx.dev](https://npmx.dev/api/registry/badge/version/@uswds-tailwind/date-picker-compat)](https://npmx.dev/package/@uswds-tailwind/date-picker-compat)
[![Open on npmx.dev](https://npmx.dev/api/registry/badge/license/@uswds-tailwind/date-picker-compat)](https://npmx.dev/package/@uswds-tailwind/date-picker-compat)

Headless [zag-js](https://zagjs.com/) state machine for the USWDS date picker component. Provides state and accessibility behavior used by `@uswds-tailwind/react` and `@uswds-tailwind/compat`.

> [!NOTE]
> This package is in **alpha**. APIs may change between releases.

## Install

```bash
npm install @uswds-tailwind/date-picker-compat@alpha
```

## Usage

This is a low-level building block. Most consumers should reach for one of the higher-level packages instead:

- React: [`@uswds-tailwind/react`](https://npmx.dev/package/@uswds-tailwind/react)
- Vanilla JS: [`@uswds-tailwind/compat`](https://npmx.dev/package/@uswds-tailwind/compat)

If you need to wire the machine up to a different framework, see the [zag-js docs](https://zagjs.com/) for the framework-agnostic machine API.

## Range endpoint selection

With `selectionMode: 'range'`, bind the start input and trigger to index `0` and the end to index `1`. Each trigger opens the shared calendar for its own input. Selection closes the calendar and preserves the other endpoint.

`api.setOpen(true, 1)` opens or switches to the end input. `api.setOpen(true)` targets the start input, including after a previous selection. The machine keeps one active endpoint and does not advance automatically from start to end.

Cells use plain `Date` values for days and numbers for months and years. React's `TableCell` and `TableCellTrigger` accept `value`; weekday headers accept `day` and `index`.

Navigation uses `getPrevTriggerProps({ unit })` and `getNextTriggerProps({ unit })`, where `unit` is `'month'`, `'year'`, or `'chunk'`. The default is `'month'`; a chunk spans 12 years. These replace the six separate navigation getters.

## Zag naming

Views share `getViewProps({ view })`, `getViewTriggerProps({ view })`, and `getTableProps({ view })`. Cell getters use `getDayTableCellProps`, `getDayTableCellTriggerProps`, `getMonthTableCellTriggerProps`, and `getYearTableCellTriggerProps`.

The shared anatomy parts are `view`, `viewTrigger`, `prevTrigger`, `nextTrigger`, and `tableCellTrigger`. Use `data-view` to distinguish views and `data-unit` to distinguish navigation steps.

React exposes `ViewTrigger` with a `view` prop and `PrevTrigger` / `NextTrigger` with a `unit` prop. These replace the separate month, year, and decade trigger components.

## License

[MIT](./LICENSE)
