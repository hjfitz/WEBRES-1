const path = require('path')

module.exports = {
	entry: {
		content: ['@babel/polyfill', path.join(__dirname, 'src', 'index.js')],
	},
	output: {
		path: path.join(__dirname, 'dist'),
		filename: '[name].js',
	},
	resolve: {
		extensions: ['.js', '.json', '.jsx', '.css'],
	},
	devtool: 'source-map',
	module: {
		rules: [
			{
				test: /\.m?js$/,
				exclude: /(node_modules|bower_components)/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env'],
					},
				},
			},
		],
	},
}
