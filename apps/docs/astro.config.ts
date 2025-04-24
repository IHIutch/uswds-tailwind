import mdx from '@astrojs/mdx'
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
import vercel from '@astrojs/vercel'
import tailwindcss from '@tailwindcss/vite'
import expressiveCode from 'astro-expressive-code'
import { defineConfig } from 'astro/config'

// https://astro.build/config
export default defineConfig({
  site: import.meta.env.DEV ? 'http://localhost:4321' : 'https://uswds-tailwind.com',
  trailingSlash: 'never',
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
  vite: {
    plugins: [tailwindcss()],
    ssr: {
      noExternal: ['nanoid'],
    },
  },
  redirects: {
    '/components': '/components/accordion',
  },
  adapter: vercel({
    webAnalytics: {
      enabled: true,
    },
  }),
})
