import { BunPlugin } from "bun";

export interface PluginBuildConfig {
  name: string;
  entry: string;
  external?: string[];
  plugins?: BunPlugin[];
}

export const createPluginConfig = (config: PluginBuildConfig) => ({
  entrypoints: [config.entry],
  outdir: "./lib",
  target: "browser",
  format: "esm",
  splitting: true,
  sourcemap: "external",
  minify: process.env.NODE_ENV === "production",
  plugins: config.plugins || [],
  external: [
    "react",
    "react-dom",
    "@mui/material",
    "@emotion/react",
    "@emotion/styled",
    "@react-page/editor",
    ...(config.external || []),
  ],
}); 