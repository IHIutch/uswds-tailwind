import type { Config } from "tailwindcss";
import sharedConfig from "@repo/tailwind-config";

const config: Pick<Config, "content" | "presets"> = {
  content: ['./src/**/*.{astro,html,ts,tsx,twig}'],
  presets: [sharedConfig],
};

export default config;
