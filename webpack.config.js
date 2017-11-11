const path = require('path');
const webpack = require('webpack');
const extractTextPlugin = require('extract-text-webpack-plugin');

const extractPlugin = new extractTextPlugin({
	filename: 'style.css'
});

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'docs'),
    publicPath: 'docs'
  },
  module:{
    
  	rules:[
        {
        	test: /\.js$/,
        	use:[
              {
              	loader: 'babel-loader',
              	options:{
              		presets:['es2015']
              	}
              }
        	]
        },
        {
        	test:/\.scss$/,
        	use: ['css-style', 'sass-loader']
        }
  	]
  },
  plugins:[
    
     extractPlugin
  ]
  
};