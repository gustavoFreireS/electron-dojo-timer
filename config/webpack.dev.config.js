var HtmlWebpackPlugin = require("html-webpack-plugin");
module.exports = {
	"externals": {
		"electron": "require('electron')",
		"child_process": "require('child_process')",
		"fs": "require('fs')",
		"path": "require('path')",
		"readline": "require('readline')"
 },
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: "babel-loader"
				}
			},
			{
				test: /\.(scss|css)$/,
				use: ["style-loader", "css-loader", "sass-loader"]
			},
			{
				test: /\.(png|jpg|gif)$/,
				use: [
					{
						loader: "file-loader",
						options: {}
					}
				]
			},
			{
				test: /\.(eot|ttf|woff|otf)$/,
				loader: "file-loader"
			}
		]
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: "./index.html",
			filename: "./index.html"
		})
	]
};
