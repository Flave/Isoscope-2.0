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

  shouldComponentUpdate: function(nextProps, nextState) {
    if(nextProps.state.map !== this.props.state.map)
      return true;
    if(nextProps.loadingStateChanged)
      return true;

/*    if(nextProps.state.hoveredCluster === this.props.state.hoveredCluster && nextProps.state.hoveredCluster !== undefined)
      return false;*/
    if(nextProps.state.hoveredIsoline === this.props.state.hoveredIsoline && nextProps.state.hoveredIsoline !== undefined)
      return false;

    return true;
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
      .map(function(clusterGroup) {
        var modeIsolines = _(clusterGroup)
          .map(function(modeCluster) {
            return _.findWhere(modeCluster.features, { properties: {departureTime: that.props.state.departureTime} });
          })
          .value();

        return {
          type: 'FeatureCollection',
          features: modeIsolines
        }
      })
      .value();
  },

  initializeIsolinesOverlay: function() {
    var that = this,
        map = this.refs.map.getMap(),
        overlaySvg = d3.select(map.getPanes().overlayPane)
          .append('svg:svg')
          .classed('m-clusters__svg', true)
          .attr("xmlns", "http://www.w3.org/2000/svg")
          .style('position', 'relative');

    this.state.isolinesOverlay
      .on('click:startlocation', this._handleClickClusterStartLocation)
      .on('mouseenter:cluster', this._handleMouseenterCluster)
      .on('mouseleave:cluster', this._handleMouseleaveCluster)
      .on('mouseenter:isoline', this._handleMouseenterIsoline)
      .on('mouseleave:isoline', this._handleMouseleaveIsoline)
      .map(map)
      .data(this.getModesCluster());

    this.setState({overlaySvg: overlaySvg});
  },

  renderOverlays: function() {
    _.defer(function() {
      this.state.isolinesOverlay
        .data(this.getModesCluster())(this.state.overlaySvg);
      }.bind(this));
  },

  /*
  * Gets the state of the map and adds it to the router state
  */
  handleMapBoundsChanged: function(event) {
    var map = event.target,
        center = map.getCenter(),
        zoom = map.getZoom(),
        mapParams = [center.lat, center.lng, zoom];

    this.props.handleTransition({map: mapParams});
  },

  _handleMapClick: function(coordinates) {
    var clusters = this.props.state.clusters.slice();
    clusters.push(coordinates);
    this.props.handleTransition({clusters: clusters});
  },

  _handleClickClusterStartLocation: function(cluster, i) {
    
  },

  _handleMouseenterCluster: function(cluster, i) {
    var startLocation = cluster.features[0].properties.startLocation.toString();
    this.props.handleTransition({hoveredCluster: startLocation});
  },

  _handleMouseleaveCluster: function(cluster, i) {
    this.props.handleTransition({hoveredCluster: undefined});
  },

  _handleMouseenterIsoline: function(isoline, i) {
    this.props.handleTransition({hoveredIsoline: isoline.properties.travelMode});
  },

  _handleMouseleaveIsoline: function(isoline, i) {
    this.props.handleTransition({hoveredIsoline: undefined});
  },

  render: function() {
    return (
      <Map 
        ref="map"
        center={this.props.state.map.slice(0,2)}
        zoom={this.props.state.map[2]}
        onMapBoundsChanged={this.handleMapBoundsChanged}
        onClick={this._handleMapClick}/>
    )
  }
});

module.exports = MapController;