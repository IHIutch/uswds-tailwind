/** @type { import('@storybook/html-vite').StorybookConfig } */
import { mergeConfig } from 'vite';
import twig from 'vite-plugin-twig-drupal'
import { join } from "node:path"


const config = {
  stories: [
    "../src/stories/**/*.stories.@(js|jsx|mjs|ts|tsx)",
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
        twig({
          namespaces: {
            components: join(__dirname, "../src/stories"),
          },
        }),
      ],
    });
  },
};
export default config;
