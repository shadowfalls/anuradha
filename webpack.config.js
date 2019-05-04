const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {
                test: /\.html$/,
                use: [
                    {
                        loader: "html-loader"
                    }
                ]
            },
            {
                test: /\.(scss|css)$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
            }
        ]
    },
    entry: './src/index.js',
    output: {
        filename: "[name].[hash].bundle.js",
        path: __dirname + "/dist"
    },
    plugins: [
        new HtmlWebPackPlugin({
            template: "./src/index.html",
            filename: "./index.html"
        }),
        new MiniCssExtractPlugin({
            filename: "[name].css",
            chunkFilename: "[id].css"
        }),
        // remove this during production
        new webpack.HotModuleReplacementPlugin(),
        new UglifyJsPlugin({ sourceMap: true })
    ],
    optimization: {
        splitChunks: {
            chunks: "all",
            minSize: 0
        },
        minimize: true,
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
        ]
    },
    mode: "development",
    devServer: {
        hot: true,
    }
};