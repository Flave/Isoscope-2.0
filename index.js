delete process.env.BROWSER;
process.env.BASE_URL = process.env.BASE_URL || '';

// Install node-jsx so we can use jsx on the server
require('node-jsx').install({extension: '.js'});
// Register babel to have ES6 support on the server
require("babel/register");
// Start the server app
require("./src/server")(function(app) {
  console.log("Express %s server listening on %s:%s", app.get("env"), app.get("host"), app.get("port"));

  if(app.get("env") === "development") {
    require("./webpack/webpack-dev-server");
  }
});