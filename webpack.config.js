const path = require('path')

module.exports = {
  devtool: 'source-map',
  entry: {
    index: './src/index.ts',
  },
  mode: 'production',
  externals: [],
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
    rules: [ { test: /\.ts(x?)$/, include: path.resolve(__dirname, 'src'), loader: 'ts-loader' } ],
  },
}
