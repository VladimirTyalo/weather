const path = require("path");
const webpack = require("webpack");


module.exports =
{
  entry: {
    app: path.resolve(__dirname, "src/js/app.js")
  },

  output: {
    filename: "app.js",
    path: path.resolve(__dirname, "src/js"),
    publicPath: "/"
  },


  devtool: "inline-source-map",
  watchOptions: {
    aggregateTimeout: 100
  },

  watch: true,

  module: {

    preLoaders: [
      {
        test: /\.js$/,
        loader: "eslint-loader",
        include: path.join(__dirname, "/src/js")
      }
    ],

    //loaders: [
    //  {
    //    test: /\.js$/,
    //    loader: "babel",
    //    include: path.resolve(__dirname, "src/js"),
    //    query: {
    //      presets: ["es2015"]
    //    }
    //  }
    //]
  },
  resolve: {
    modulesDirectories: ['node_modules'],
    extensions: ['', '.js']
  },
}