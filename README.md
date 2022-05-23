# esbuild-plugin-imagemin

An [esbuild](https://esbuild.github.io/) plugin for minimizing images using [imagemin](https://github.com/imagemin/imagemin)

## Install

```bash
yarn add -D esbuild-plugin-imagemin
# or
npm install --save-dev esbuild-plugin-imagemin
```

## Usage

```js
const esbuild = require("esbuild");
const imageminPlugin = require("esbuild-plugin-imagemin");

esbuild.build({
  plugins: [imageminPlugin()],
});
```

ESM import is also included.

The plugin works with png, jpg, gif and svg.

By default this plugin uses:

- [imagemin-mozjpeg](https://github.com/imagemin/imagemin-mozjpeg)
- [imagemin-gifsicle](https://www.npmjs.com/package/imagemin-gifsicle)
- [imagemin-pngquant](https://www.npmjs.com/package/imagemin-pngquant)
- [imagemin-svgo](https://www.npmjs.com/package/imagemin-svgo)

## Configuration

```js
interface ImageminPluginOptions {
  disableDefaultPlugins?: {
    mozjpeg?: boolean,
    pngquant?: boolean,
    svgo?: boolean,
    gifsicle?: boolean,
  };
  defaultPluginsOptions?: {
    mozjpeg?: mozjpeg.Options,
    pngquant?: pngquant.Options,
    svgo?: svgo.Options,
    gifsicle?: gifsicle.Options,
  };
  plugins?: Array<(input: Buffer) => Promise<Buffer>>;
}
```

### disableDefaultPlugins

You can disable some(or even all) of default plugins by passing their names inside `disableDefaultPlugins` with true value

```js
// only svgo and pngquant will work
esbuild.build({
  plugins: [
    imageminPlugin({
      disableDefaultPlugins: {
        mozjpeg: true,
        gifsicle: true,
      },
    }),
  ],
});
```

### defaultPluginsOptions

You can pass options inside default plugins. You can find the options format in plugins documentation.

```js
esbuild.build({
  plugins: [
    imageminPlugin({
      defaultPluginsOptions: {
        mozjpeg: {
          quality: 50,
        },
      },
    }),
  ],
});
```

### plugins

You can pass any other imagemin plugins with options

```js
const imageminOptipng = require("imagemin-optipng");

esbuild.build({
  plugins: [
    imageminPlugin({
      plugins: [imageminOptipng({ optimizationLevel: 5 })],
    }),
  ],
});
```
