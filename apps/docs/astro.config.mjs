import { defineConfig } from 'astro/config';
import mdx from "@astrojs/mdx";
import tailwind from "@astrojs/tailwind";
import alpinejs from "@astrojs/alpinejs";
import expressiveCode from 'astro-expressive-code'

// https://astro.build/config
export default defineConfig({
  integrations: [
    tailwind(),
    // expressiveCode({
    //   themes: ['light-plus'],
    // }),
    mdx(),
    alpinejs({ entrypoint: "/src/utils/alpine/entrypoint" }),
  ]
});
