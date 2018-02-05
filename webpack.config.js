const webpack = require('webpack');

module.exports = {
  entry: ['babel-polyfill', './src/index.jsx'],
  output: {
    path: __dirname,
    publicPath: '/',
    filename: 'bundle.js',
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.js|.jsx$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              'babel-preset-env',
              'babel-preset-react',
            ],
            plugins: [
              'transform-object-rest-spread',
            ],
          },
        },
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader?modules=true&camelCase=true',
            options: {
              modules: true,
              /* eslint-disable no-unused-vars */
              getLocalIdent: (context, localIdentName, localName, options) => localName,
              /* eslint-enable no-unused-vars */
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        API_URL: JSON.stringify(process.env.API_URL || 'http://localhost:3000/'),
      },
    }),
    new webpack.SourceMapDevToolPlugin({
      filename: 'report_factory.js.map',
    }),
  ],
  devServer: {
    port: 3001,
    historyApiFallback: true,
    contentBase: './',
    inline: true,
  },
};
