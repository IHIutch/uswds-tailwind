/** @type { import('@storybook/html-vite').StorybookConfig } */
import { mergeConfig } from 'vite';
import twig from 'vite-plugin-twig-loader'

const config = {
  stories: [
    "../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)",
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
  async viteFinal(config, { configType }) {
    return mergeConfig(config, {
      plugins: [
        twig(),
      ],
    });
  },
};
export default config;
