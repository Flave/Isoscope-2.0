var React = require('react'),
    Map = require('./map/MapController.react'),
    Drawer = require('./drawer/Drawer.react'),
    Menu = require('./menu/Menu.react'),
    hereApi = require('../apis/here'),
    _ = require('lodash'),
    Q = require('q'),
    ClusterActions = require('../actions/ClusterActions'),
    ClustersStore = require('../stores/ClustersStore');



function getAllClusters() {
  return ClustersStore.getAll();
}

function getClusters(settings) {
  return ClustersStore.get(settings);
}

var Component = React.createClass({
  contextTypes: {
    router: React.PropTypes.func.isRequired,
  },
  getInitialState: function() {
    return {
      drawerIsOpen: false,
      clusters: [],
      isolineSettings: {
        travelTime: 2,
        weekday: 0,
        travelMode: 'car'
      }
    }
  },

  componentDidMount: function() {
    var that = this;
    ClustersStore.addChangeListener(function() {
      that.setState({clusters: getAllClusters()});
    })
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
/*    var promise = ClusterActions.add({
      travelMode: that.state.travelMode,
      weekday: that.state.weekday,
      startLocation: [e.latlng.lat, e.latlng.lng]
    });*/

    var promise = hereApi.getCluster({
      travelMode: that.state.travelMode,
      weekday: that.state.weekday,
      startLocation: [e.latlng.lat, e.latlng.lng]
    });

    promise.then(function() {
      console.log('cluster loaded');
    });
  },


  /*
  * GENERAL INTERACTION
  */

  handleDrawerToggle: function() {
    this.setState({drawerIsOpen: !this.state.drawerIsOpen});
  },

  handleSettingsChanged: function(_settings) {
    var settings = _.assign({}, this.state.isolineSettings, _settings);

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
            <Drawer 
              isOpen={this.state.drawerIsOpen} 
              clusters={this.state.clusters}/>
        </div>
      )
  }
});

module.exports = Component;