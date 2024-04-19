const config = {
  stories: [
    "../src/components/**/*.stories.@(js|ts)",
  ],

  addons: [
    "@storybook/addon-a11y",
    "@storybook/addon-essentials",
    "@storybook/addon-links",
    "@chromatic-com/storybook",
  ],

  framework: {
    name: "@storybook/html-vite",
    options: {},
  },

  docs: {
    autodocs: false
  }
};
export default config;
