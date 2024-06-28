import type { Config } from "tailwindcss";
import sharedConfig from "@repo/tailwind-config";
import tailwindTypography from '@tailwindcss/typography'

const config: Config = {
  content: ['./src/**/*.{astro,html,ts,tsx,twig,mdx,md}'],
  presets: [sharedConfig],
  plugins: [
    tailwindTypography({
      className: 'docs-prose'
    }),
  ],
};

export default config;
