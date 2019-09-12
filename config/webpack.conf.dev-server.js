const webpack = require("webpack");

const merge = require("webpack-merge");

const baseConfig = require("./webpack.conf.base.js");

module.exports = merge(baseConfig, {
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