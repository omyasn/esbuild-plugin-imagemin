import { PluginBuild } from "esbuild";
import jpegtran from "imagemin-jpegtran";
import pngquant, { Options as pngquantOptions } from "imagemin-pngquant";
import gifsicle from "imagemin-gifsicle";

type DefaultPluginName = "jpegtran" | "pngquant" | "svgo" | "gifsicle";

interface DefaultPluginsConfig {
  name: DefaultPluginName;
  extension: string;
  plugin: (input: Buffer) => Promise<Buffer>;
}

interface ImageminPluginOptions {
  plugins?: Array<(input: Buffer) => Promise<Buffer>>;
  defaultPluginsOptions?: {
    jpegtran?: jpegtran.Options;
    pngquant?: pngquantOptions;
    svgo?: Record<string, unknown>;
    gifsicle?: gifsicle.Options;
  };
  disableDefaultPlugins?: Partial<Record<DefaultPluginName, boolean>>;
}

const imageminPlugin = ({
  plugins = [],
  defaultPluginsOptions = {},
  disableDefaultPlugins = {},
}: ImageminPluginOptions = {}) => ({
  name: "imageminPlugin",
  setup(build: PluginBuild) {
    build.onLoad({ filter: /\.(png|jpg|gif|svg)$/ }, async (args) => {
      const imagemin = (await import("imagemin")).default;
      const svgo = (await import("imagemin-svgo")).default;

      const defaultPluginsConfig: DefaultPluginsConfig[] = [
        {
          name: "jpegtran",
          extension: "jpg",
          plugin: jpegtran(defaultPluginsOptions.jpegtran),
        },
        {
          name: "pngquant",
          extension: "png",
          plugin: pngquant(defaultPluginsOptions.pngquant),
        },
        {
          name: "gifsicle",
          extension: "gif",
          plugin: gifsicle(defaultPluginsOptions.gifsicle),
        },
        {
          name: "svgo",
          extension: "svg",
          plugin: svgo(defaultPluginsOptions.svgo),
        },
      ];

      const fileExtension = args.path.slice(-3);

      const defaultPlugins = defaultPluginsConfig
        .filter(
          (pluginConfig) =>
            !disableDefaultPlugins[pluginConfig.name] &&
            pluginConfig.extension === fileExtension
        )
        .map((pluginConifg) => pluginConifg.plugin);

      const minimizedResult = await imagemin([args.path], {
        plugins: [...defaultPlugins, ...plugins],
      });

      return { contents: minimizedResult[0].data, loader: "file" };
    });
  },
});

export = imageminPlugin;
