import * as esbuild from "esbuild";
import pkg from "../package.json";

const config: esbuild.BuildOptions = {
  bundle: true,
  logLevel: "info",
  entryPoints: ["./index.ts"],
  platform: "node",
  external: [...Object.keys(pkg.dependencies)],
};

const formats = {
  esm: ".mjs",
  cjs: ".js",
};

Object.entries(formats).forEach(([format, extension]) => {
  esbuild
    .build({
      ...config,
      format: format as esbuild.Format,
      outdir: "./dist",
      outExtension: {
        ".js": extension,
      },
    })
    .catch(() => process.exit(1));
});
