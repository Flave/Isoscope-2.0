var React = require('react'),
    Router = require('react-router'),
    L;

if(process.env.BROWSER) {
  L = require('leaflet');
}

var Map = React.createClass({
  mixins: [Router.Navigation],
  getDefaultProps: function() {
    return { 
      center: [52.52301038652483,13.390789031982422],
      zoom: 13
    }
  },
  componentDidMount: function() {
    var mapContainer = this.refs.mapContainer.getDOMNode();

    this.map = L.map(mapContainer);

    this.map
      .setView(L.latLng(this.props.center), this.props.zoom);

    this.throtteledTransition = _.throttle(this.transitionMap, 500);

    this.map
      .on('moveend', this.handleMapBoundsChanged)
      .on('click', this._handleClick);

    L.tileLayer('https://{s}.tiles.mapbox.com/v4/flaviogortana.2efcca31/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiZmxhdmlvZ29ydGFuYSIsImEiOiJzalRHcS1JIn0.aeJmH09S2p_hjOSs3wuT3w', {
        id: 'examples.map-20v6611k',
    }).addTo(this.map);

    this.map.zoomControl.setPosition('bottomright');

    this.handleDebouncedClick = _.debounce(this._handleDebouncedClick, 600);
    this.prevClicks = 0;
  },

  componentWillUpdate: function(nextProps) {
    this.throtteledTransition(nextProps);
  },

  transitionMap: function(nextProps) {
    this.map.setView(L.latLng(nextProps.center), nextProps.zoom, {
      animate: true,
      duration: .8
    });
  },

  _handleDebouncedClick: function(coordinates) {
    this.props.onClick(coordinates);
    this.prevClicks = 0;
  },

  _handleClick: function(e) {
    var coordinates = _.map([e.latlng.lat, e.latlng.lng], parseFloat);
    if(this.prevClicks > 0) {
      this.handleDebouncedClick.cancel();
      this.prevClicks = 0;
    }
    else {
      this.prevClicks++;
      this.handleDebouncedClick(coordinates);
    }
  },

  handleMapBoundsChanged: function(e) {
    this.props.onMapBoundsChanged(e);
  },

  getMap: function() {
    return this.map;
  },

  render: function() {
    return (<div className="map-container" ref="mapContainer"></div>)
  }
});

module.exports = Map;