var React = require('react'),
    Router = require('react-router'),
    L;

if(process.env.BROWSER) {
  L = require('leaflet');
}

var map;

var Map = React.createClass({
  getDefaultProps: function() {
    return { 
      lat: 52.522644823574645,
      lng: 13.40628147125244,
      zoom: 13
    }
  },
  mixins: [Router.Navigation],
  componentDidMount: function() {
    var mapContainer = this.refs.mapContainer.getDOMNode();
    map = L.map(mapContainer, {
      center: [this.props.lat, this.props.lng],
      zoom: this.props.zoom
    })
      .on('moveend', this.props.handleMapMoveEnd)
      .on('click', this.props.handleClick);

    L.tileLayer('https://{s}.tiles.mapbox.com/v4/flaviogortana.2efcca31/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiZmxhdmlvZ29ydGFuYSIsImEiOiJzalRHcS1JIn0.aeJmH09S2p_hjOSs3wuT3w', {
        id: 'examples.map-20v6611k',
    }).addTo(map);
  },

  getMap: function() {
    return map;
  },

  render: function() {
    return (<div className="map-container" ref="mapContainer"></div>)
  }
});

module.exports = Map;