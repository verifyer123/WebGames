var webpack = require('webpack');
var path = require('path')
var FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
var JavaScriptObfuscator = require('webpack-obfuscator');

var DIST_DIR = path.resolve(__dirname, "dist")
var SRC_DIR = path.resolve(__dirname, "src")
module.exports = {
	entry: SRC_DIR + "/app/index.js",
	output: {
		path: DIST_DIR + '/app',
		filename: "login.min.js",
		publicPath: "/app/",
		library: "loginModal",
		libraryTarget: "var"
	},
	module: {
		loaders: [
			{
				test: /\.js?$/,
				include: SRC_DIR,
				loader: "babel-loader",
				query: {
					presets: ["react", "env", "stage-2"]
				},
			}
		],
	},
	plugins: [
		new webpack.NoEmitOnErrorsPlugin(),
		new FriendlyErrorsWebpackPlugin(),
		new JavaScriptObfuscator()
	]

};