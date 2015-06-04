var React = require('react'),
    Map = require('./map/MapController.react'),
    Drawer = require('./drawer/Drawer.react'),
    Menu = require('./menu/Menu.react'),
    hereApi = require('../apis/here'),
    _ = require('lodash'),
    Q = require('q'),
    IsolineActions = require('../actions/IsolineActions'),
    IsolinesStore = require('../stores/IsolinesStore');

function getAllIsolines() {
  return IsolinesStore.getAll();
}

var Component = React.createClass({
  contextTypes: {
    router: React.PropTypes.func.isRequired,
  },
  getInitialState: function() {
    return {
      drawerIsOpen: false,
      clusters: [],
      travelTime: 2,
      hourOfDay: 0,
      weekday: 0,
      travelMode: 'car'
    }
  },

  componentDidMount: function() {
    var that = this;
    IsolinesStore.addChangeListener(function() {
      that.setState({clusters: getAllIsolines()});
    })
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
    var that = this;
    var promises = _.range(24).map(function(hour) {
      return hereApi.get({
        travelMode: that.state.travelMode,
        travelTime: hour,
        weekday: that.state.weekday,
        startLocation: [e.latlng.lat, e.latlng.lng]
      });
    });

    Q.all(promises)
      .spread(function() {
        IsolineActions.add(arguments[0]);
/*        _.forEach(arguments, function(isoline) {
          IsolineActions.add(isoline);
        })*/
      });
  },

  render: function() {
    var mapParams = this.extractMapParams();

    return (
        <div className="controller-view">
          <Map 
            lat={mapParams.lat} 
            lng={mapParams.lng} 
            zoom={mapParams.zoom}
            clusters={this.state.clusters}
            handleMapClick={this.handleMapClick} />
            <Menu 
              handleDrawerToggle={this.handleDrawerToggle}
              isOpen={this.state.drawerIsOpen} />
            <Drawer isOpen={this.state.drawerIsOpen} />
        </div>
      )
  }
});

module.exports = Component;