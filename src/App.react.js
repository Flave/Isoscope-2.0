var React = require('react'),
    Router = require('react-router'),
    RouteHandler = Router.RouteHandler;

require('app/utility');

var App = React.createClass({
  componentDidMount: function() {
    
  },
  render: function() {
    return (<div className="app-container">
        <RouteHandler/>
      </div>)
  }
});

module.exports = App;