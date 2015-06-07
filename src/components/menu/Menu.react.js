var React = require('react'),
    ViewSettings = require('./ViewSettings.react');


var Menu = React.createClass({
  getInitialState: function() {
    return {
        viewSettingsIsOpen: false
    }
  },
  componentDidMount: function() {
    var viewSettingsToggle = this.refs.viewSettingsToggle.getDOMNode();
    var viewSettings = this.refs.viewSettings.getDOMNode();
  },

  handleViewSettingsToggle: function() {
    this.setState({viewSettingsIsOpen: !this.state.viewSettingsIsOpen});
  },

  render: function() {
    var isOpenClassName = this.props.isOpen ? 'is-open' : '';
    var className = isOpenClassName + ' menu';
    
    return (
      <div className={className}>
        <button className="btn" onClick={this.props.handleDrawerToggle}>Timeline</button>
        <button className="btn" ref="viewSettingsToggle" onClick={this.handleViewSettingsToggle}>Settings</button>
        <button className="btn">Layers</button>
        <ViewSettings isOpen={this.state.viewSettingsIsOpen} ref="viewSettings" />
      </div>
    );
  }
});

module.exports = Menu;