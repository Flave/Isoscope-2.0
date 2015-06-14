var React = require('react'),
    Router = require('react-router'),
    L;

if(process.env.BROWSER) {
  L = require('leaflet');
}

var map;

var Map = React.createClass({
  mixins: [Router.Navigation],
  getDefaultProps: function() {
    return { 
      lat: 52.522644823574645,
      lng: 13.40628147125244,
      zoom: 13
    }
  },
  componentDidMount: function() {
    var mapContainer = this.refs.mapContainer.getDOMNode();
    map = L.map(mapContainer)
      .on('load', this.handleMapBoundsChanged)
      .on('moveend', this.props.handleMapMoveEnd)
      .on('moveend', this.handleMapBoundsChanged)
      .on('zoomend', this.handleMapBoundsChanged)
      .on('click', this.props.handleClick);

    map.setView(L.latLng([this.props.lat, this.props.lng]), this.props.zoom);

    L.tileLayer('https://{s}.tiles.mapbox.com/v4/flaviogortana.2efcca31/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiZmxhdmlvZ29ydGFuYSIsImEiOiJzalRHcS1JIn0.aeJmH09S2p_hjOSs3wuT3w', {
        id: 'examples.map-20v6611k',
    }).addTo(map);
  },

  handleMapBoundsChanged: function(e) {
    var mapBounds = map.getBounds();
    this.props.handleMapBoundsChanged(mapBounds);
  },

  getMap: function() {
    return map;
  },

  render: function() {
    return (<div className="map-container" ref="mapContainer"></div>)
  }
});

module.exports = Map;