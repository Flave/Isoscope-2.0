var d3 = require('d3'),
    L;

if(process.env.BROWSER) {
  L = require('leaflet');
}

function IsolinesOverlay() {
  var group,
      map,
      clusters,
      svg,
      transform = d3.geo.transform({point: projectPoint}),
      path = d3.geo.path().projection(transform),
      isolines;


  function _isolinesOverlay(_svg) {
    svg = _svg;

    group = svg
      .selectAll('g.clusters-container')
      .data([clusters]);

    group
      .enter()
      .append('g')
      .classed('leaflet-zoom-hide', true)
      .classed('clusters-container', true);

    isolines = group
      .selectAll('path.isoline')
      .data(function(clusters) { return clusters.features; })
      .enter()
      .append('path')
      .classed('isoline', true);

    reset();
  }

  _isolinesOverlay.clusters = function(_clusters) {
    if(!arguments.length) return clusters;
    clusters = _clusters;
    return _isolinesOverlay;
  }

  _isolinesOverlay.map = function(_map) {
    if(!arguments.length) return map;
    !map && _map.on('viewreset', reset);
    map = _map;
    return _isolinesOverlay;
  }

  function projectPoint(x, y) {
    var point = map.latLngToLayerPoint(new L.LatLng(y, x));
    this.stream.point(point.x, point.y);
  }

  function reset() {
    // only render stuff if there is actually some geometry
    if(clusters.features.length) {
      var bounds = path.bounds(clusters),
          topLeft = bounds[0],
          bottomRight = bounds [1];

      svg
        .attr('width', bottomRight[0] - topLeft[0])
        .attr('height', bottomRight[1] - topLeft[1])
        .style('left', topLeft[0] + 'px')
        .style('top', topLeft[1] + 'px');

      group.attr("transform", "translate(" + -topLeft[0] + "," + -topLeft[1] + ")");
      isolines.attr("d", path);
    }
  }

  return _isolinesOverlay;
}

module.exports = IsolinesOverlay;