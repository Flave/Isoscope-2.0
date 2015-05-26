var React = require('react');
var Map = require('./Map/Index.js');

var Component = React.createClass({
  contextTypes: {
    router: React.PropTypes.func.isRequired
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
  render: function() {
    var mapParams = this.extractMapParams();

    return (
        <div className="controller-view">
          <Map lat={mapParams.lat} lng={mapParams.lng} zoom={mapParams.zoom} />
        </div>
      )
  }
});

module.exports = Component;