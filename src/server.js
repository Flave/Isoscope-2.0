var express = require('express');
var path = require('path');
var render = require('./server/render');

var server = express();


if (server.get("env") === "production") {
  server.use(express.static(path.resolve(__dirname, "../public"), {
    maxAge: 365 * 24 * 60 * 60
  }));
}

server.use(render);


server.set("port", process.env.PORT || 3000);

server.listen(server.get("port"), function() {
  console.log('Express' +  server.get("env") + 'server listening on' +  server.get("port"));
});