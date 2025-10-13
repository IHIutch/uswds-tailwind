import { defineConfig } from 'astro/config';
import mdx from "@astrojs/mdx";
import tailwind from "@astrojs/tailwind";
import alpinejs from "@astrojs/alpinejs";
// @ts-expect-error
import tailwindNesting from '@tailwindcss/nesting';
import expressiveCode from "astro-expressive-code";
import react from "@astrojs/react";
import cloudflare from '@astrojs/cloudflare'

import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: import.meta.env.DEV ? 'http://localhost:4321' : 'https://uswds-tailwind.com',
  integrations: [
    expressiveCode({
      themes: ['light-plus', 'dark-plus'],
      styleOverrides: {
        frames: {
          editorBackground: '#f7f9fa',
          terminalBackground: '#f7f9fa',
          terminalTitlebarBackground: '#ffffff',
          frameBoxShadowCssValue: '0'
        },
        codeBackground: '#f7f9fa'
      }
    }),
    tailwind(),
    mdx(),
    alpinejs({
      entrypoint: "/src/utils/alpine/entrypoint"
    }),
    react(),
    sitemap()
  ],
  // markdown: {
  //   shikiConfig: {
  //     themes: {
  //       light: 'light-plus',
  //       dark: 'dark-plus'
  //     }
  //   }
  // },
  adapter: cloudflare({
    imageService: 'compile',
    // routes: {
    //   extend: {
    //     include: [{ pattern: '/actions/**' }],
    //     exclude: [{ pattern: '/**' }]
    //   }
    // }
  }),
  vite: {
    css: {
      postcss: {
        plugins: [tailwindNesting()]
      }
    },
    // https://docs.astro.build/en/guides/integrations-guide/cloudflare/#nodejs-compatibility
    ssr: {
      external: ['node:fs', 'node:path', 'twig']
    },
    build: {
      // https://docs.astro.build/en/guides/integrations-guide/cloudflare/#meaningful-error-messages
      minify: false,
    }
  },
  redirects: {
    '/components': '/components/accordion'
  }
});
