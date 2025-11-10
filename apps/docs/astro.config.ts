import cloudflare from '@astrojs/cloudflare'
import mdx from '@astrojs/mdx'
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite'
import expressiveCode from 'astro-expressive-code'
import { defineConfig } from 'astro/config'

// https://astro.build/config
export default defineConfig({
  site: import.meta.env.DEV ? 'http://localhost:4321' : 'https://v2.uswds-tailwind.com',
  output: 'server',
  integrations: [
    expressiveCode({
      themes: ['light-plus', 'dark-plus'],
      styleOverrides: {
        frames: {
          editorBackground: '#f7f9fa',
          terminalBackground: '#f7f9fa',
          terminalTitlebarBackground: '#ffffff',
          frameBoxShadowCssValue: '0',
        },
        codeBackground: '#f7f9fa',
      },
      shiki: {
        bundledLangs: ['html', 'ts', 'js', 'css', 'json', 'bash', 'graphql'],
        engine: 'javascript',
      },
    }),
    mdx(),
    react(),
    sitemap(),
  ],
  // markdown: {
  //   shikiConfig: {
  //     themes: {
  //       light: 'light-plus',
  //       dark: 'dark-plus'
  //     }
  //   }
  // },
  adapter: cloudflare(),
  vite: {
    plugins: [tailwindcss()],
    // https://docs.astro.build/en/guides/integrations-guide/cloudflare/#nodejs-compatibility
    ssr: {
      external: ['node:fs', 'node:path'],
      noExternal: ['@uswds-tailwind/compat'],
    },

    build: {
      // https://docs.astro.build/en/guides/integrations-guide/cloudflare/#meaningful-error-messages
      minify: false,
    },
  },
  redirects: {
    '/components': '/components/accordion',
  },
})
