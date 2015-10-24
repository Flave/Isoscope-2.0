var React = require('react');

var App = React.createClass({
  componentDidMount: function() {
    
  },
  render: function() {
    console.log('rendering root component');
    return (<div className="app-container">
        App rendered
      </div>)
  }
});

module.exports = App;