var React = require('react'),
    hereApi = require('../../apis/here-isolines.js'),
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
    console.log(viewSettingsToggle);
  },

  handleViewSettingsToggle: function() {
    this.setState({viewSettingsIsOpen: !this.state.viewSettingsIsOpen});
  },

  render: function() {
    var isOpenClassName = this.props.isOpen ? 'is-open' : '';
    var className = isOpenClassName + ' menu';
    
    return (
      <div className={className}>
        <button onClick={this.props.handleDrawerToggle}>Timeline</button>
        <button ref="viewSettingsToggle" onClick={this.handleViewSettingsToggle}>View Setting</button>
        <ViewSettings isOpen={this.state.viewSettingsIsOpen} ref="viewSettings" />
      </div>
    );
  }
});

module.exports = Menu;