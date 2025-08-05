import antfu from '@antfu/eslint-config'

export default antfu({
  typescript: true,
  astro: true,
  pnpm: true,
  stylistic: {
    indent: 2,
    quotes: 'single',
  },
})
