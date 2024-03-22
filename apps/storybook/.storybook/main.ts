import { dirname, join } from "path";
import { mergeConfig } from 'vite';
import twig from 'vite-plugin-twig-drupal'

const config = {
  stories: [
    "../src/components/**/*.stories.@(js|ts)",
  ],

  addons: [
    getAbsolutePath("@storybook/addon-a11y"),
    getAbsolutePath("@storybook/addon-essentials"),
    getAbsolutePath("@storybook/addon-links"),
  ],

  framework: {
    name: getAbsolutePath("@storybook/html-vite"),
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

function getAbsolutePath(value: string): any {
  return dirname(require.resolve(join(value, "package.json")));
}
