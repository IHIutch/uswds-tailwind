/** @type { import('@storybook/html-vite').StorybookConfig } */
import { mergeConfig } from 'vite';
import twig from 'vite-plugin-twig-drupal'
import { join } from "node:path"


const config = {
  stories: [
    "../src/components/**/*.stories.@(js|ts)",
  ],

  addons: [
    '@storybook/addon-a11y',
    "@storybook/addon-essentials",
    "@storybook/addon-links",
  ],

  framework: {
    name: "@storybook/html-vite",
    options: {},
  },

  viteFinal(config) {
    return mergeConfig(config, {
      plugins: [
        twig(),
      ],
    });
  },
};
export default config;
