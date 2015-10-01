var React = require('react'),
    classNames = require('classnames'),
    locations = require('app/config/locations'),
    _ = require('lodash');


var LocationSearch = React.createClass({
  render: function() {
    return (
      <ul className='m-locations-ui'>
        {_.map(locations, function(location, i) {
          return (
            <li 
              className={classNames('m-locations-ui__location', {'is-active': (this.props.state.location === location)})}
              key={i} 
              onClick={this._handleItemClick.bind(this, location)}>
              {location.label}
            </li>
          )
        }.bind(this))}
      </ul>
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