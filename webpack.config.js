var path = require('path')
var webpack = require('webpack')

module.exports = {
    entry: path.resolve(__dirname, './src/main.js'),
    output:
    {
        path: path.resolve(__dirname, './build/res'),
        publicPath: '/build/res/',
        filename: 'index.js'
    },
    module:
    {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.styl$/,
                loader: 'style-loader!css-loader!stylus-loader'
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        new webpack.LoaderOptionsPlugin(
            {
                minimize: true
            }),
        new webpack.optimize.UglifyJsPlugin(
            {
                compress:
                {
                    warnings: false
                }
            })
    ]
}