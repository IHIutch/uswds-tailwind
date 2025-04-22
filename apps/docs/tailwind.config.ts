import tailwindTypography from '@tailwindcss/typography'
import sharedConfig from '@uswds-tailwind/theme/tailwind.config.ts'

const config = {
  presets: [sharedConfig],
  plugins: [
    tailwindTypography({
      className: 'docs-prose',
    }),
  ],

}

export default config
