// include styles if environment is browser?!
if(process.env.BROWSER) {
  require('./style/main.scss');
}

var React = require('react');
var Router = require('react-router');
var RouteHandler = Router.RouteHandler;
var routes = require('./routes.js');

Router.run(routes, Router.HistoryLocation, function (Handler, state) {
  React.render(<Handler routerState={state} />, document.getElementById('root'));
});