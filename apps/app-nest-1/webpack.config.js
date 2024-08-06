const { NxAppWebpackPlugin } = require('@nx/webpack/app-plugin');
const { join } = require('path');

module.exports = {
  output: {
    path: join(__dirname, '../../dist/apps/app-nest-1'),
    /**
     * Enable breakpoints in the source code when debugging using
     * VSCode JavaScript Debug Terminal and CWD is the root of the Nx workspace
     *
     * https://github.com/nrwl/nx/issues/21517#issuecomment-2242902642
     * https://webpack.js.org/configuration/output/#outputdevtoolmodulefilenametemplate
     * https://webpack.js.org/configuration/output/#outputdevtoolfallbackmodulefilenametemplate
     */
    devtoolModuleFilenameTemplate: '[absolute-resource-path]',
  },
  plugins: [
    // https://nx.dev/recipes/webpack/webpack-plugins#nxappwebpackplugin
    new NxAppWebpackPlugin({
      target: 'node',
      compiler: 'tsc',
      main: './src/main.ts',
      tsConfig: './tsconfig.app.json',
      assets: ['./src/assets'],
      optimization: false,
      outputHashing: 'none',
      skipTypeChecking: true, // Default: false
      sourceMap: true, // Default: false
    }),
  ],
};
