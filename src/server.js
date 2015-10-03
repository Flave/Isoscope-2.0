var express = require('express'),
    path = require('path'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    serveFavicon = require('serve-favicon'),
    render = require('./server/render');

const staticPath = path.resolve(__dirname, '../static');

module.exports = function(callback) {
  var server = express();

  server.set("env", process.env.NODE_ENV || "development");
  server.set("host", process.env.HOST || "0.0.0.0");
  server.set("port", process.env.PORT || 3000);

  server.use(morgan(server.get("env") === "production" ? "combined" : "dev"));
  server.use(bodyParser.json());
  server.use(cookieParser());
  server.use(serveFavicon(`${staticPath}/assets/favicon.ico`));

  // In development, the compiled javascript is served by a WebpackDevServer, which lets us 'hot load' scripts in for live editing.
  if (process.env.NODE_ENV === "development") {
    require("../webpack/webpack-dev-server");
  }

  // for static files
  // in development this will be static images, fonts etc
  // in production this will also include compiled js and css
  server.use(express.static(path.resolve(__dirname, staticPath), {
    maxAge: 365 * 24 * 60 * 60
  }));

  // For API requests or other non react/page requests
  //require('./server/routes')(server);

  server.use(render);

  server.set("port", process.env.PORT || 3002);

  server.listen(server.get("port"), function() {
    callback(server);
  });
}