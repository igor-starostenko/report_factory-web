const merge = require('webpack-merge');

const common = require('./webpack.common.js');

module.exports = merge(common, {
  devtool: 'inline-source-map',
  mode: 'development',
  devServer: {
    port: 3001,
    historyApiFallback: true,
    contentBase: './public',
    inline: true,
  },
});
