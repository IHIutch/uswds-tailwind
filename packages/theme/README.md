# @uswds-tailwind/theme

[![Open on npmx.dev](https://npmx.dev/api/registry/badge/version/@uswds-tailwind/theme)](https://npmx.dev/package/@uswds-tailwind/theme)
[![Open on npmx.dev](https://npmx.dev/api/registry/badge/license/@uswds-tailwind/theme)](https://npmx.dev/package/@uswds-tailwind/theme)

A [Tailwind CSS v4](https://tailwindcss.com/) theme that exposes USWDS design tokens (colors, spacing, typography, breakpoints) as `@theme` variables.

> [!NOTE]
> This package is in **alpha**. APIs may change between releases. Pin exact versions and read the [changelog](https://github.com/IHIutch/uswds-tailwind/releases) before upgrading.

## Install

```bash
npm install -D @uswds-tailwind/theme@alpha tailwindcss
```

## Usage

Import the theme alongside Tailwind in your global CSS:

```css
@import 'tailwindcss';
@import '@uswds-tailwind/theme';
```

If you're using `@uswds-tailwind/react`, you don't need to import this package directly. The React stylesheet already pulls it in.

## What's included

- USWDS color, spacing, and typography tokens as Tailwind v4 `@theme` variables
- [`@tailwindcss/forms`](https://github.com/tailwindlabs/tailwindcss-forms) and [`@tailwindcss/typography`](https://github.com/tailwindlabs/tailwindcss-typography) presets
- [`tailwindcss-animate`](https://github.com/jamiebuilds/tailwindcss-animate) utilities

USWDS-recommended fonts ([Public Sans](https://public-sans.digital.gov/), Source Sans 3, Merriweather, Roboto Mono, Open Sans) and icon sets (`material-symbols`, Font Awesome via `@iconify/tailwind4`) are declared as `optionalDependencies`. Install only what you use.

## License

[MIT](https://github.com/IHIutch/uswds-tailwind/blob/next/LICENSE)
