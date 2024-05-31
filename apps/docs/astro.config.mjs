import { defineConfig } from 'astro/config';
import mdx from "@astrojs/mdx";
import tailwind from "@astrojs/tailwind";
import alpinejs from "@astrojs/alpinejs";

// https://astro.build/config
export default defineConfig({
  integrations: [
    tailwind(),
    mdx(),
    alpinejs({ entrypoint: "/src/utils/alpine/entrypoint" }),
  ]
});
