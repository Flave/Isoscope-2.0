delete process.env.BROWSER;

// Install node-jsx so we can use jsx on the server
require('node-jsx').install({extension: '.js'});
// Register babel to have ES6 support on the server
require("babel/register");
// Start the server app
require("./src/server");