import { defineMain } from '@storybook/react-vite/node'

export default defineMain({
  stories: ['../src/**/*.stories.@(ts|tsx|mdx)'],
  addons: ['@storybook/addon-docs'],
  features: {
    // Helps show full source code in docs: https://tetra.chromatic.com/?path=/docs/components-accordion--docs
    experimentalCodeExamples: true,
  },
  framework: '@storybook/react-vite',
  typescript: {
    reactDocgen: 'react-docgen',
  },
})
