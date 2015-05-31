var React = require('react'),
    Map = require('./map/Map.react'),
    Drawer = require('./drawer/Drawer.react'),
    Menu = require('./menu/Menu.react');

var Component = React.createClass({
  contextTypes: {
    router: React.PropTypes.func.isRequired
  },
  getInitialState: function() {
    return {
      drawerIsOpen: false
    }
  },

  extractMapParams: function() {
    var defaultParams, mapQuery, mapParams;

    defaultParams = {lat: 52.5, lng: 13.2, zoom: 14};
    mapQuery = this.context.router.getCurrentQuery().map;
    if(!mapQuery) return defaultParams;
    mapParams = mapQuery.split(',');
    
    return {
      lat: parseInt(mapParams[0]) || defaultParams.lat,
      lng: parseInt(mapParams[1]) || defaultParams.lng,
      zoom: parseInt(mapParams[2]) || defaultParams.zoom
    };
  },

  handleDrawerToggle: function() {
    this.setState({drawerIsOpen: !this.state.drawerIsOpen});
  },

  handleMapClick: function(e) {

  },

  render: function() {
    var mapParams = this.extractMapParams();

    return (
        <div className="controller-view">
          <Map 
            lat={mapParams.lat} 
            lng={mapParams.lng} 
            zoom={mapParams.zoom} 
            handleClick={this.handleMapClick} />
            <Menu 
              handleDrawerToggle={this.handleDrawerToggle}
              isOpen={this.state.drawerIsOpen} />
            <Drawer isOpen={this.state.drawerIsOpen} />
        </div>
      )
  }
});

module.exports = Component;