var React = require('react');
var Router = require('react-router');
var RouteHandler = Router.RouteHandler;
var L;

if(process.env.BROWSER) {
  L = require('leaflet');
}


var App = React.createClass({
  getDefaultProps: function() {
    return { 
      lat: 52,
      lng: -13,
      zoom: 12
    }
  },
  mixins: [Router.Navigation],
  componentDidMount: function() {
    var mapContainer = this.refs.mapContainer.getDOMNode();
    var map = L.map(mapContainer, {
      center: [this.props.lat, this.props.lng],
      zoom: this.props.zoom
    })
      .on('moveend', this.handleMoveMapEnd)
      .on('click', this.handleMapClick);

    L.tileLayer('https://{s}.tiles.mapbox.com/v4/flaviogortana.2efcca31/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiZmxhdmlvZ29ydGFuYSIsImEiOiJzalRHcS1JIn0.aeJmH09S2p_hjOSs3wuT3w', {
        id: 'examples.map-20v6611k',
    }).addTo(map);

    // Is there an alternative to set state which doesn't update the component?
    this.setState({map: map});
  },

  handleMapClick: function(e) {
    console.log(e);
  },

  /*
  * Gets the state of the map and adds it to the router state
  */
  handleMoveMapEnd: function(e) {
    var map = this.state.map;
    var {lat, lng} = map.getCenter();
    var zoom = map.getZoom();
    var mapParams = `${lat},${lng},${zoom}`;
    
    // FIX: The position seems to be a bit of when reloading
    // TBD: Check if there are other params/queries and readd them
    this.replaceWith('/', {}, {map: mapParams});
  },

  render: function() {
    return (<div className="map-container" ref="mapContainer"></div>)
  }
});

module.exports = App;