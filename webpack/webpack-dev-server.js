// Starts a webpack dev server for dev environments

var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./dev.config');

new WebpackDevServer(webpack(config), {
  publicPath: config.output.publicPath,
  hot: true,
  historyApiFallback: true
}).listen(3001, 'localhost', function (err, result) {
  if (err) {
    console.log(err);
  }

  console.log('Webpack Hot loader is listening at localhost:3001');
});