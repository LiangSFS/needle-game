const path = require("path");
const merge = require("webpack-merge");

const baseConfig = require("./webpack.conf.base.js");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = merge({
  devtool: "source-map",
  mode: process.env.NODE_ENV,  //在命令行赋值  借用cross-env 包跨脚本传值
  output: {
    path: path.resolve(__dirname, "../dist"),
    filename: "static/js/app.[hash:6].js"
  },
  plugins: [
     new CleanWebpackPlugin()  
  ]
}, baseConfig);
