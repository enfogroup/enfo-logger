const path = require('path')

module.exports = {
  devtool: false,
  entry: {
    index: './src/index.ts',
  },
  mode: 'production',
  externals: [ 'winston', 'logform' ],
  resolve: {
    symlinks: false,
    extensions: [ '.js', '.json', '.ts' ],
  },
  output: {
    libraryTarget: 'commonjs2',
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
  },
  target: 'node',
  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        include: path.resolve(__dirname, 'src'),
        loader: 'esbuild-loader',
        options: {
          target: 'es2020',
          sourcemap: false,
          loader: 'ts',
        },
      },
    ],
  },
}
