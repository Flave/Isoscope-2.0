delete process.env.BROWSER;

// Register babel to have ES6 support on the server
require('node-jsx').install({extension: '.js'});
require("babel/register");
// Start the server app
require("./src/server");