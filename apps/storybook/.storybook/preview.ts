/** @type { import('@storybook/html').Preview } */

// import '../src/assets/main.css';
import '../src/assets/main';

const preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    viewport: {
      viewports: {
        mobile: {
          name: 'Mobile',
          styles: {
            width: '320px',
            height: '568px',
          },
        },
        mobileLg: {
          name: 'Mobile Large',
          styles: {
            width: '480px',
            height: '960px',
          },
        },
        tablet: {
          name: 'Tablet',
          styles: {
            width: '640px',
            height: '360px',
          },
        },
        tabletLg: {
          name: 'Tablet Large',
          styles: {
            width: '880px',
            height: '495px',
          },
        },
        desktop: {
          name: 'Desktop',
          styles: {
            width: '1024px',
            height: '768px',
          },
        },
        desktopLg: {
          name: 'Desktop Large',
          styles: {
            width: '1200px',
            height: '900px',
          },
        },
      }
    }
  },
};

export default preview;
