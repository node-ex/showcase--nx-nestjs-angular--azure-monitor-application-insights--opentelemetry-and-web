const { NxAppWebpackPlugin } = require('@nx/webpack/app-plugin');
const { join } = require('path');

module.exports = {
  output: {
    path: join(__dirname, '../../dist/apps/app-nest-1'),
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
    }),
  ],
};
