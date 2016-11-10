var path = require('path')
var webpack = require('webpack')

module.exports = {
	entry: './src/main.js',
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
			loader: 'vue',
		},
		{
			test: /\.js$/,
			loader: 'babel',
			exclude: /node_modules/
		},
		{
			test: /\.(png|jpg|gif|svg|ttf)$/,
			loader: 'file',
			options:
			{
				name: '[name].[ext]?[hash]'
			}
		}]
	},
	resolve:
	{
		alias:
		{
			'vue$': 'vue/dist/vue'
		}
	},
	plugins: [
		new webpack.LoaderOptionsPlugin(
		{
			minimize: true
		})
	]
}