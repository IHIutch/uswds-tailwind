# USWDS + Tailwind vanilla starter

A minimal Vite app with HTML, TypeScript, Tailwind CSS v4, and USWDS + Tailwind vanilla components. Requires Node.js 22.12.0 or later.

```bash
npm install
npm run dev
```

Edit `index.html` to build your site. `src/main.ts` loads the styles and `@uswds-tailwind/compat/auto`, which initializes components from their `data-scope` and `data-part` attributes. `src/styles.css` imports Tailwind and the USWDS theme, including its fonts.

```bash
npm run build
npm run preview
```

The build checks TypeScript and writes the production site to `dist/`. Publish that directory with your static hosting provider.

This starter installs USWDS + Tailwind through npm's `latest` tag, which currently selects the v2 beta packages. APIs may change between releases. See the [vanilla getting-started guide](https://uswds-tailwind.com/docs/vanilla/getting-started) for setup and the component documentation.
