/** @type { import('@storybook/html').Preview } */

// import '../assets/main.css';
import '../assets/main.js';

const preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
};

export default preview;
