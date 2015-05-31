var React = require('react');

var App = React.createClass({
  getDefaultProps: function() {
    return {
      isOpen: false
    }
  },
  render: function() {
    var isOpenClassName = this.props.isOpen ? 'is-open' : '';
    var className = isOpenClassName + ' drawer';

    return (<div className={className}></div>)
  }
});

module.exports = App;