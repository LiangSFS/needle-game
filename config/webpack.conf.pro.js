const path = require("path");
const merge = require("webpack-merge");

const baseConfig = require("./webpack.conf.base.js");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = merge({
  mode: process.env.NODE_ENV,
  output: {
    path: path.resolve(__dirname, "../build"),
    publicPath: "/",  //dist目录下的文件放在服务器/根目录下中才能加载静态资源
    filename: "static/js/app.[hash:6].js"
  },
  plugins: [
     new CleanWebpackPlugin()  
  ]
}, baseConfig);