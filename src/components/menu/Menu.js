var React = require('react');

var App = React.createClass({
  render: function() {
    var isOpenClassName = this.props.isOpen ? 'is-open' : '';
    var className = isOpenClassName + ' menu';

    return (
      <div className={className}>
        <button onClick={this.props.handleDrawerToggle}>Timeline</button>
        <button>View Setting</button>
      </div>
    );
  }
});

module.exports = App;