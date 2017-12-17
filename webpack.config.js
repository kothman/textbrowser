var HTMLWebpackPlugin = require('html-webpack-plugin');
var HTMLWebpackPluginConfig = new HTMLWebpackPlugin({
    template: __dirname + '/src/index.html',
    filename: 'index.html',
    inject: 'body'
});

module.exports = {
    entry: __dirname + '/src/index.js',
    module: {
	loaders: [
	    {
		test: /\.js$/,
		exclude: /node_modules/,
		use: 'babel-loader'
	    },
	    {
		test: /\.css$/,
		exclude: /node_modules/,
		use: ['style-loader', 'css-loader']
	    },
	    {
		test: /\.css$/,
		include: /node_modules/,
		use: ['style-loader', 'css-loader']
	    }
	]
    },
    output: {
	filename: 'index.js',
	path: __dirname
    },
    plugins: [HTMLWebpackPluginConfig]
};

