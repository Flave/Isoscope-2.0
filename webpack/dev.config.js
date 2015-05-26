// This is the webpack config to use during development.
// It enables the hot module replacement, the source maps and inline CSS styles.

var path = require("path");
var webpack = require("webpack");

const assetsPath = path.resolve(__dirname, "../public/assets");

const WEBPACK_HOST = "localhost";
const WEBPACK_PORT = parseInt(process.env.PORT) + 1 || 3001;

console.log(__dirname);

module.exports = {
  entry: {
    "main": [
      `webpack-dev-server/client?http://${WEBPACK_HOST}:${WEBPACK_PORT}`,
      "webpack/hot/only-dev-server",
      "./src/client.js"
    ]
  },
  output: {
    path: assetsPath,
    filename: "bundle.js",
    publicPath: `http://${WEBPACK_HOST}:${WEBPACK_PORT}/assets/`
  },
  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loaders: ["react-hot", "babel"] },
      { test: /\.scss$/, loader: 'style!css!autoprefixer?browsers=last 2 versions!sass?sourceMap=true&sourceMapContents=true' },
      { test: /\.css$/, loader: 'style!css' }
    ]
  },
  progress: true,
  plugins: [

    // hot reload
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),

    new webpack.DefinePlugin({
      "process.env": {
        BROWSER: JSON.stringify(true),
        NODE_ENV: JSON.stringify("development")
      }
    })
  ],
  devtool: '#inline-source-map'
};