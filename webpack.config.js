const webpack = require('webpack')
const { resolve } = require('path')
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    context: resolve(__dirname, 'examples'),
    entry: [
        // bundle the client for webpack-dev-server
        // and connect to the provided endpoint
        // 'webpack-dev-server/client?http://' + require("os").hostname() + ':8080/',
        // bundle the client for hot reloading
        // only- means to only hot reload for successful updates
        'webpack/hot/only-dev-server',
        // the entry point of our app
        './index.js'
    ],
    output: {
        filename: 'bundle.js',
        // the output bundle
        path: resolve(__dirname, 'examples'),
        publicPath: '/'
        // necessary for HMR to know where to load the hot update chunks
    },
    devtool: 'inline-source-map',
    devServer: {
        host: 'localhost', 
        port: 8080,
        hot: true,
        // match the output path
        contentBase: resolve(__dirname, 'examples'),
        // match the output `publicPath`
        publicPath: '/'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader'
                },
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.json']
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin()
    ]
};
