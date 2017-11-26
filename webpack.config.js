module.exports = {
  entry: ['./app/index.js'],
  output: {
    path: `${__dirname}/build`,
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              'babel-preset-env',
              'babel-preset-react',
            ],
          },
        },
      },
    ],
  },
  devServer: {
    port: 3001,
    contentBase: './build',
    inline: true,
  },
};
