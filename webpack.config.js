var path = require("path");
var webpack = require("webpack");
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './source/scripts/entry.js',
    output: {
    	path: path.resolve(__dirname, './dist'),
    	publicPath: '',
    	filename: 'static/js/[name]bundle.js',
        chunkFilename: 'static/js/[id].chunk.js',
    	
    },
    module: {
        loaders: [
            {test: /\.css$/, loader: 'style-loader!css-loader'},
            {
                test: /\.jsx?$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015']
                }
            },
            {
            	test: /\.html$/,
            	loader: 'html-loader',
            },
            {
                test: /\.(svg|png|jpeg|jpg|gif)$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: 'static/img/[name].[ext]'
                }
            },
        ]
    },
    devServer: {
        hot: true,
        historyApiFallback: true,
        contentBase: './dist',
        host: 'localhost',
        inline: true
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new ExtractTextPlugin('css/[name].css'),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendors',
            chunks: ['entry'],
            minChunks: 1
        }),
        new HtmlWebpackPlugin({
            favicon: './source/images/favicon.ico',
            filename: './index.html',
            template: './index.html',
            inject: 'body',
            hash: true,
            minify: {
                removeComments: true,
                collapseWhitespace: false
            }
        }),
    ]
};

