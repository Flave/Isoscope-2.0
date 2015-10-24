console.log('running js');
if(process.env.BROWSER) {
  require('./style/main.scss');
}

var React = require('react');
var Router = require('react-router');
var RouteHandler = Router.RouteHandler;
var routes = require('./routes.js');

Router.run(routes, Router.HistoryLocation, function (Handler, state) {
  console.log('rendering shit');
  console.log(document.getElementById('root'));
  console.log(Handler);
  console.log(state);
  React.render(<Handler routerState={state} />, document.getElementById('root'));
});