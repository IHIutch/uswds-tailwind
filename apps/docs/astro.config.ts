import { defineConfig } from 'astro/config';
import mdx from "@astrojs/mdx";
import tailwind from "@astrojs/tailwind";
import alpinejs from "@astrojs/alpinejs";
// @ts-expect-error
import tailwindNesting from '@tailwindcss/nesting';
import expressiveCode from "astro-expressive-code";

import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  trailingSlash: 'never',
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
    react()
  ],
  // markdown: {
  //   shikiConfig: {
  //     themes: {
  //       light: 'light-plus',
  //       dark: 'dark-plus'
  //     }
  //   }
  // },
  vite: {
    css: {
      postcss: {
        plugins: [tailwindNesting()]
      }
    }
  },
  redirects: {
    '/components': '/components/accordion'
  }
});
