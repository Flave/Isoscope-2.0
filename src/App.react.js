var React = require('react'),
    Router = require('react-router'),
    RouteHandler = Router.RouteHandler,
    hereApi = require('./apis/here-isolines');

var App = React.createClass({
  componentDidMount: function() {
    hereApi.get();
  },
  render: function() {
    return (<div className="app-container">
        <RouteHandler/>
      </div>)
  }
});

module.exports = App;