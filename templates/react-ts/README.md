# USWDS + Tailwind React starter

A minimal Vite app with React, TypeScript, Tailwind CSS v4, and USWDS + Tailwind React components. Requires Node.js 22.12.0 or later.

```bash
npm install
npm run dev
```

Edit `src/App.tsx` to build your app. `src/styles.css` imports Tailwind and the component stylesheet, which includes the USWDS theme and fonts. Import components through their public subpaths, such as `@uswds-tailwind/react/accordion`.

```bash
npm run build
npm run preview
```

The build checks TypeScript and writes the production site to `dist/`. Publish that directory with your static hosting provider.

This starter installs USWDS + Tailwind through npm's `latest` tag, which currently selects the v2 beta packages. APIs may change between releases. See the [React getting-started guide](https://uswds-tailwind.com/docs/react/getting-started) for setup and the component documentation.
