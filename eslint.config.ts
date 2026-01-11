import antfu from '@antfu/eslint-config'

// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
// import storybook from 'eslint-plugin-storybook'

export default antfu({
  typescript: true,
  astro: true,
  pnpm: true,
  stylistic: {
    indent: 2,
    quotes: 'single',
  },
})
