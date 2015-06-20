var React = require('react');


var Menu = React.createClass({
  getInitialState: function() {
    return {
        isOpen: false
    }
  },

  handleToggle: function() {
    this.setState({isOpen: !this.state.isOpen});
  },

  render: function() {
    var isOpenClass = this.props.isActive ? 'is-open' : '';

    return (
      <div className={`popover ${isOpenClass}`}>
        <div ref="trigger" onClick={this.handleToggle}>
          {this.props.trigger}
        </div>
        <div className="content">
          {this.props.children}
        </div>
      </div>
    );
  }
});

module.exports = Menu;