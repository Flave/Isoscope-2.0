var React = require('react'),
    Map = require('./map/MapController.react'),
    Drawer = require('./drawer/Drawer.react'),
    Menu = require('./menu/Menu.react.js'),
    hereApi = require('../apis/here'),
    route360Api = require('../apis/route360'),
    _ = require('lodash'),
    Q = require('q'),
    ClusterActions = require('../actions/ClusterActions'),
    ClustersStore = require('../stores/ClustersStore');



function getClusters(config) {
  return ClustersStore.get(config);
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
      weekday: 0,
      travelMode: 'car',
      mapBounds: undefined
    }
  },

  componentDidMount: function() {
    var that = this;
    ClustersStore.addChangeListener(function() {
      that.setState({clusters: getClusters(that.getIsolineConfig())});
    })
  },

  shouldComponentUpdate: function(nexProps, nextState) {
    
    return (true
        // don't update if mapBounds changed
        //this.props !== nextProps.mapBounds
      )
  },

  getIsolineConfig: function() {
    return {
      travelMode: this.state.travelMode,
      weekday: this.state.weekday,
      travelTime: this.state.travelTime,
    }
  },

  extractMapParams: function() {
    var defaultParams, mapQuery, mapParams;

    defaultParams = {lat: 52.522644823574645, lng: 13.40628147125244, zoom: 14};
    mapQuery = this.context.router.getCurrentQuery().map;
    if(!mapQuery) return defaultParams;
    mapParams = mapQuery.split(',');
    
    return {
      lat: parseInt(mapParams[0]) || defaultParams.lat,
      lng: parseInt(mapParams[1]) || defaultParams.lng,
      zoom: parseInt(mapParams[2]) || defaultParams.zoom
    };
  },


  /*
  * MAP INTERACTION
  */

  handleMapClick: function(e) {
    var that = this;
    ClusterActions.add({
      travelMode: that.state.travelMode,
      weekday: that.state.weekday,
      travelTime: that.state.travelTime,
      startLocation: [e.latlng.lat, e.latlng.lng]
    });
  },

  handleMapBoundsChanged: function(mapBounds) {
    this.setState({mapBounds: mapBounds});
  },


  /*
  * GENERAL INTERACTION
  */

  handleDrawerToggle: function() {
    this.setState({drawerIsOpen: !this.state.drawerIsOpen});
  },

  handleIsolinesSettingsChange: function(_settings) {
    var nextState = _.assign({}, this.state, _settings);
    this.setState(nextState);

    ClusterActions.update({
      travelMode: nextState.travelMode,
      weekday: nextState.weekday,
      travelTime: nextState.travelTime
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
            handleMapClick={this.handleMapClick}
            handleMapBoundsChanged={this.handleMapBoundsChanged} />
          <Menu 
            handleDrawerToggle={this.handleDrawerToggle}
            handleIsolinesSettingsChange={this.handleIsolinesSettingsChange}
            isOpen={this.state.drawerIsOpen} />
          <Drawer
            travelTime={this.state.travelTime}
            isOpen={this.state.drawerIsOpen} 
            clusters={this.state.clusters}/>
        </div>
      )
  }
});

module.exports = Component;