const path = require("path");
const merge = require("webpack-merge");

const baseConfig = require("./webpack.conf.base.js");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = merge({
  devtool: "source-map",
  mode: "development",
  output: {
    path: path.resolve(__dirname, "../devDist"),
    filename: "static/js/app.[hash:6].js"
  },
  plugins: [
     new CleanWebpackPlugin()  
  ]
}, baseConfig);
