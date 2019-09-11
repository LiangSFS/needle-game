const webpack = require("webpack");

const merge = require("webpack-merge");

const devConfig = require('./webpack.config.js');

module.exports = merge(devConfig, {
 entry: "./src/index.dev-server.js",
 plugins: [
   new webpack.HotModuleReplacementPlugin()  
 ],
 devServer: {
    open: true,
    port: 4000,
    publicPath: "/",
    hot: true
  }
})