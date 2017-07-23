var path = require("path");
var webpack = require("webpack");

module.exports = {
    entry: './source/scripts/entry.js',
    output: {
        filename: './source/scripts/bundle.js'
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
            }
        ]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
    ]
};

