const path = require("path");
const webpack = require("webpack");

module.exports = {
  entry: ["./index.js"],
  context: path.resolve(__dirname, "src/js/"),


  output: {
    filename: "./index.js",
    path: path.resolve(__dirname, "public/js"),
    publicPath: "/"
  },

  watch: true,

  devServer: {
    contentBase: "./public",
    hot: true
  },

  resolve: {
    modulesDirectories: ["node_modules"],
    extensions: ["", ".js"]
  },
  devtool: "inline-source-map",
  watchOptions: {
    aggregateTimeout: 100
  },

  module: {

    preLoaders: [
      {
        test: /\.js$/,
        loader: "eslint-loader",
        include: [
          path.resolve(__dirname, "/js/"),
          "!" + path.resolve(__dirname, "/vendor")
        ]
      }
    ],

    loaders: [
      {
        test: /\.js$/,
        loader: "babel",
        include: path.resolve(__dirname, "src/js"),
        query: {
          presets: ["es2015"]
        }
      }
    ]
  },


  plugins: [

  ]


};