const path = require("path");
const webpack = require("webpack");

let plugins = [];

if (process.env.NODE_ENV === "production") {
  plugins = [
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false,
        screw_ie8: false
      }
    }),
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV)
    })
  ];
}

module.exports = {
  devtool: "#source-map",
  entry: {
    home: path.join(__dirname, "src/index.js"),
  },
  output: {
    path: path.join(__dirname, "/dist/"),
    filename: "[name].js",
    publicPath: "/"
  },
  plugins,
  resolve: { extensions: ["", ".js", ".jsx"] },
  module: {
    loaders: [
      { test: /\.css$/,
        loaders: ["style-loader", "css-loader"] },
      { test: /\.svg$/, loader: "svg-inline" },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: "babel",
        query: {
          presets: ["es2015", "stage-0", "react"]
        }
      }
    ]
  }
};
