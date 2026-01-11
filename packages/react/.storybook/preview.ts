import addonDocs from '@storybook/addon-docs'
import { definePreview } from '@storybook/react-vite'

import './styles.css'

export default definePreview({
  tags: ['autodocs'],
  parameters: {
    docs: {
      source: {
        type: 'dynamic',
      },
    },
    // More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'padded',
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },

  addons: [addonDocs()],
})
