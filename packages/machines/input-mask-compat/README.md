# @uswds-tailwind/input-mask-compat

[![Open on npmx.dev](https://npmx.dev/api/registry/badge/version/@uswds-tailwind/input-mask-compat)](https://npmx.dev/package/@uswds-tailwind/input-mask-compat)
[![Open on npmx.dev](https://npmx.dev/api/registry/badge/license/@uswds-tailwind/input-mask-compat)](https://npmx.dev/package/@uswds-tailwind/input-mask-compat)

Headless [zag-js](https://zagjs.com/) state machine for the USWDS masked input component. Provides state and accessibility behavior used by `@uswds-tailwind/react` and `@uswds-tailwind/compat`.

> [!NOTE]
> This package is in **alpha**. APIs may change between releases.

## Install

```bash
npm install @uswds-tailwind/input-mask-compat@alpha
```

## Usage

This is a low-level building block. Most consumers should reach for one of the higher-level packages instead:

- React: [`@uswds-tailwind/react`](https://npmx.dev/package/@uswds-tailwind/react)
- Vanilla JS: [`@uswds-tailwind/compat`](https://npmx.dev/package/@uswds-tailwind/compat)

If you need to wire the machine up to a different framework, see the [zag-js docs](https://zagjs.com/) for the framework-agnostic machine API.

## Behavior

The [USWDS 3.14 input mask](https://github.com/uswds/uswds/blob/v3.14.0/packages/usa-input-mask/src/index.js) formats uncontrolled input on `keyup`. The mask filters characters and formats separators; the input's native `pattern` and other form attributes determine validity.

The machine also supports controlled values and a `setValue()` method:

| Change | Effective value and input | `onValueChange` |
| --- | --- | --- |
| Uncontrolled keyup or `setValue()` | Format and commit the proposal | Reports the formatted proposal |
| Controlled input edit or `setValue()` | Format the proposal; keep the parent's accepted value until it changes | Reports the formatted proposal |
| Parent changes controlled `value` | Format and display the accepted value | Does not fire |

The overlay displays the effective value followed by the unused portion of the mask. A React `Field` may supply an invalid state, but the mask does not infer one from partial input.

## License

[MIT](./LICENSE)
