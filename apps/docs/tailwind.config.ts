import sharedConfig from "@repo/tailwind-config";
import tailwindTypography from '@tailwindcss/typography'

const config = {
  content: ['./src/**/*.{astro,html,ts,tsx,twig,mdx,md}'],
  presets: [sharedConfig],
  plugins: [
    tailwindTypography({
      className: 'docs-prose'
    }),
  ],
};

export default config;
