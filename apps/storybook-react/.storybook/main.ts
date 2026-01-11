import type { StorybookConfig } from '@storybook/react-vite'

const config: StorybookConfig = {
  stories: [
    '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
  addons: [
    '@storybook/addon-docs',
  ],
  features: {
    // Helps show full source code in docs: https://tetra.chromatic.com/?path=/docs/components-accordion--docs
    experimentalCodeExamples: true,
  },
  framework: '@storybook/react-vite',
  typescript: {
    reactDocgen: 'react-docgen',
  },
}
export default config
