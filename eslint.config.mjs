import antfu from '@antfu/eslint-config'

async function handleJsLint(antfuConfig) {
  const config = await antfuConfig
  return [
    ...config,
    {
      files: ['**/packages/compat/**/*.js'],
      rules: {
        ...config.reduce(
          (acc, { rules = {} }) => {
            return Object.keys(rules)
              .reduce((acc, key) => {
                // if (key.startsWith(`${pluginName}/`)) {
                acc[key] = 'off'
                // }
                return acc
              }, acc)
          },
          {},
        ),

        'no-undef': 'error',
        'no-unused-vars': 'error',
        'no-unused-expressions': 'error',
      },
    },
  ]
}

export default handleJsLint(antfu({
  typescript: true,
  stylistic: {
    indent: 2,
    quotes: 'single',
  },
}))

// export default antfu({
//   typescript: true,
//   stylistic: {
//     indent: 2,
//     quotes: 'single',
//   },
//   ignores: [
//     '**/packages/compat/**/*.js',
//   ],
// },
// )
