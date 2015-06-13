var express = require('express'),
    path = require('path'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    render = require('./server/render');

var server = express();

server.use(morgan("dev"));
server.use(bodyParser.json());
server.use(cookieParser());

// In development, the compiled javascript is served by a WebpackDevServer, which lets us 'hot load' scripts in for live editing.
if (process.env.NODE_ENV === "development") {
  require("../webpack/webpack-dev-server");
}

if (server.get("env") === "production") {
  server.use(express.static(path.resolve(__dirname, "../public"), {
    maxAge: 365 * 24 * 60 * 60
  }));
}

// For API requests or other non react/page requests
//require('./server/routes')(server);

server.use(render);

server.set("port", process.env.PORT || 3000);

server.listen(server.get("port"), function() {
  console.log('Express' +  server.get("env") + 'server listening on' +  server.get("port"));
});