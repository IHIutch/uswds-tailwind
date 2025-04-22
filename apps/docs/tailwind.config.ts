import type { Config } from 'tailwindcssv3'
import tailwindTypography from '@tailwindcss/typography'
import sharedConfig from '@uswds-tailwind/tailwind-config'

const config: Config = {
  content: ['./src/**/*.{astro,html,ts,tsx,twig,mdx,md}'],
  presets: [sharedConfig],
  plugins: [
    tailwindTypography({
      className: 'docs-prose',
    }),
  ],
}

export default config
