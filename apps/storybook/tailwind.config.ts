import type { Config } from "tailwindcss";
import sharedConfig from "@repo/tailwind-config";

const config: Pick<Config, "content" | "presets"> = {
  content: ["./src/components/**/*.twig"],
  presets: [sharedConfig],
};

export default config;
