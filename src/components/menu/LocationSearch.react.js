var React = require('react'),
    classNames = require('classnames'),
    locations = require('app/config/locations'),
    _ = require('lodash');


var LocationSearch = React.createClass({
  render: function() {
    return (
      <div/>
    );
  },

  _handleItemClick: function(location) {
    this.props.handleTransition({
      location: location,
      map: location.map
    });
  }
});

module.exports = LocationSearch;