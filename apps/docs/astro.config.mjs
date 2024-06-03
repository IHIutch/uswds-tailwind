import { defineConfig } from 'astro/config';
import mdx from "@astrojs/mdx";
import tailwind from "@astrojs/tailwind";
import alpinejs from "@astrojs/alpinejs";

// https://astro.build/config
export default defineConfig({
  trailingSlash: 'never',
  integrations: [
    tailwind(),
    mdx(),
    alpinejs({ entrypoint: "/src/utils/alpine/entrypoint" }),
  ],
  markdown: {
    shikiConfig: {
      themes: {
        light: 'github-dark',
        dark: 'github-dark',
      },
    }
  }
});
