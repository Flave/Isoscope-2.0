var React = require('react');
var Router = require('react-router');
var RouteHandler = Router.RouteHandler;

var App = React.createClass({
  render: function() {
    return (<div className="app-container">
        <RouteHandler/>
      </div>)
  }
});

module.exports = App;