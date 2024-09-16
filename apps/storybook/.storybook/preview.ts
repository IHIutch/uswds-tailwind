import { fn } from '@storybook/test';

import '../build/js/main.js';
import '../build/css/styles.css';

const preview = {
  parameters: {
    layout: 'fullscreen',
    actions: {
      args: {
        onClick: fn()
      },
    },
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
