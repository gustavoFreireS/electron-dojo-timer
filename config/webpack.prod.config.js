var HtmlWebpackPlugin = require("html-webpack-plugin");
var webpack = require("webpack");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
var UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const productionConfiguration = function(env) {
	const NODE_ENV = env.NODE_ENV ? env.NODE_ENV : "development";
	return {
		plugins: [
			new webpack.DefinePlugin({
				"process.env.NODE_ENV": JSON.stringify(NODE_ENV)
			})
		]
	};
};
module.exports = {
	optimization: {
		minimizer: [
			new UglifyJsPlugin({
				uglifyOptions: {
					mangle: {
						keep_fnames: true
					}
				}
			})
		]
	},
	module: {
		rules: [
			{
				test: /\.(gif|png|jpe?g|svg)$/i,
				use: [
					"file-loader",
					{
						loader: "image-webpack-loader"
					}
				]
			},
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: "babel-loader"
				}
			},
			{
				test: /\.(eot|ttf|woff|otf)$/,
				loader: "file-loader"
			},
			{
				test: /\.scss$/,
				use: ExtractTextPlugin.extract({
					fallback: "style-loader",
					use: "css-loader!sass-loader"
				})
			}
		]
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: "./index.html",
			filename: "./index.html"
		}),
		new ExtractTextPlugin("style.css"),
		new OptimizeCssAssetsPlugin()
	]
};
