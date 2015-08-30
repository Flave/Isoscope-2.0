var React = require('react'),
    Router = require('react-router'),
    hereApi = require('../../apis/here'),
    IsolinesOverlay = require('./IsolinesOverlay'),
    d3 = require('d3'),
    _ = require('lodash'),
    Map = require('./Map.react');

var MapController = React.createClass({
  mixins: [Router.Navigation],
  getInitialState: function() {
    return {
      overlaySvg: undefined,
      isolinesOverlay: IsolinesOverlay()
    }
  },
  componentDidMount: function() {
    this.initializeIsolinesOverlay();
  },

  componentDidUpdate: function() {
    this.renderOverlays();
  },

  /**
  * @return {array} An array of FeatureCollections with one isoline for every travelmode as feature
  */
  getModesCluster: function() {
    var that = this;
    return _(that.props.clusters)
      .map(function(cluster) {
        return  _.findWhere(cluster.features, { properties: {departureTime: that.props.state.departureTime} });
      })
      .groupBy(function(isoline) {
        return isoline.properties.startLocation.toString();
      })
      .map(function(isolines) {
        return {
          type: 'FeatureCollection',
          features: isolines
        }
      })
      .value();
  },

  initializeIsolinesOverlay: function() {
    var that = this,
        map = this.refs.map.getMap(),
        overlaySvg = d3.select(map.getPanes().overlayPane)
          .append('svg')
          .style('position', 'relative');

    this.state.isolinesOverlay
      .map(map)
      .data(this.getModesCluster());

    this.setState({overlaySvg: overlaySvg});
  },

  renderOverlays: function() {
    this.state.isolinesOverlay
      .data(this.getModesCluster())(this.state.overlaySvg);
  },

  /*
  * Gets the state of the map and adds it to the router state
  */
  handleMapMoveEnd: function(event) {
    var map = event.target;
    var center = map.getCenter();
    var zoom = map.getZoom();
    var mapParams = `${center.lat},${center.lng},${zoom}`;
  },

  _handleMapClick: function(e) {
    var clusters = this.props.state.clusters.slice();
    clusters.push([e.latlng.lat, e.latlng.lng]);
    this.props.handleStateChange({clusters: clusters});
  },

  render: function() {
    return (
      <Map 
        ref="map"
        handleMapBoundsChanged={this.props.handleMapBoundsChanged}
        handleMapMoveEnd={this.handleMapMoveEnd}
        handleClick={this._handleMapClick}/>
    )
  }
});

module.exports = MapController;