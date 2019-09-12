const path = require("path");
const merge = require("webpack-merge");

const baseConfig = require("./webpack.conf.base.js");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = merge({
  mode: "production",
  output: {
    path: path.resolve(__dirname, "../dist"),
    publicPath: "/",  //dist目录下的文件放在服务器/根目录下中才能加载静态资源
    filename: "assets/js/app.[hash:6].js"
  },
  plugins: [
     new CleanWebpackPlugin()  
  ]
}, baseConfig);