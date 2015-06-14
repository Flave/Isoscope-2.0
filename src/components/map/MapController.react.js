var React = require('react'),
    Router = require('react-router'),
    hereApi = require('../../apis/here'),
    IsolinesOverlay = require('./IsolinesOverlay'),
    ClustersStore = require('../../stores/ClustersStore'),
    d3 = require('d3'),
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

/*  shouldComponentUpdate: function(nextProps, nextState) {
    return ;
  },*/

  initializeIsolinesOverlay: function() {
    var map = this.refs.map.getMap();
    var overlaySvg = d3.select(map.getPanes().overlayPane)
      .append('svg')
      .style('position', 'relative');

    this.state.isolinesOverlay
      .map(map)
      .data(this.props.clusters);

    this.setState({overlaySvg: overlaySvg});
  },

  renderOverlays: function() {
    this.state.isolinesOverlay
      .data(this.props.clusters)(this.state.overlaySvg);
  },

  /*
  * Gets the state of the map and adds it to the router state
  */
  handleMapMoveEnd: function(event) {
    var map = event.target;
    var center = map.getCenter();
    var zoom = map.getZoom();
    var mapParams = `${center.lat},${center.lng},${zoom}`;

    // FIX: The position seems to be a bit of when reloading
    // TBD: Check if there are other params/queries and readd them
    this.replaceWith('/', {}, {map: mapParams});
  },

  render: function() {
    return (
      <Map 
        ref="map"
        handleMapBoundsChanged={this.props.handleMapBoundsChanged}
        handleMapMoveEnd={this.handleMapMoveEnd}
        handleClick={this.props.handleMapClick}/>
    )
  }
});

module.exports = MapController;