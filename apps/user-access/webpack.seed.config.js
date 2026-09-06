const { NxAppWebpackPlugin } = require('@nx/webpack/app-plugin');
const { join } = require('path');
const { commonAliases } = require('../../webpack.aliases');

module.exports = {
  resolve: {
    alias: commonAliases(__dirname),
  },
  output: {
    path: join(__dirname, '../../dist/apps/user-access-seed'),
  },
  plugins: [
    new NxAppWebpackPlugin({
      target: 'node',
      compiler: 'tsc',
      main: './src/seed.ts',
      tsConfig: './tsconfig.app.json',
      optimization: false,
      outputHashing: 'none',
      generatePackageJson: false,
      sourceMaps: true,
    }),
  ],
};
