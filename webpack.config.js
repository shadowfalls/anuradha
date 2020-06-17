const HtmlWebPackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');

module.exports = {
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
          },
        ],
      },
      {
        test: /\.(scss|css)$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
      { test: /\.eot(\?[0-9a-z\-=]+)?$/, loader: 'file-loader' },
      {
        test: /\.woff$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 50000,
          },
        },
      },
      { test: /\.ttf(\?[0-9a-z\-=]+)?$/, loader: 'file-loader' },
      { test: /\.svg(\?[0-9a-z\-=]+)?$/, loader: 'file-loader' },
    ],
  },
  entry: './src/index.js',
  output: {
    filename: '[name].[hash].bundle.js',
    path: `${__dirname}/dist`,
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: './src/index.html',
      filename: './index.html',
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
    // remove this during production
    new webpack.HotModuleReplacementPlugin(),
  ],
  optimization: {
    splitChunks: {
      chunks: 'all',
      minSize: 0,
    },
    minimize: false,
    minimizer: [
      // new UglifyJsPlugin({
      //     uglifyOptions: {
      //         compress: {
      //             /*(...)*/
      //         },
      //         output: {
      //             /*(...)*/
      //         }
      //     }
      // })
    ],
  },
  mode: 'development',
  devServer: {
    hot: false,
  },
  devtool: 'source-map',
};
