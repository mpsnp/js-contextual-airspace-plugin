const webpack = require('webpack');
const { resolve } = require('path');

module.exports = {
    context: resolve(__dirname, 'examples'),
    entry: [
        'webpack/hot/only-dev-server',
        './index.js'
    ],
    output: {
        filename: 'bundle.js',
        path: resolve(__dirname, 'examples'),
        publicPath: '/'
    },
    devtool: 'inline-source-map',
    devServer: {
        host: 'localhost', 
        port: 8080,
        hot: true,
        contentBase: resolve(__dirname, 'examples'),
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
