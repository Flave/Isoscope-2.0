var d3 = require('d3'),
    L;

if(process.env.BROWSER) {
  L = require('leaflet');
}

function IsolinesOverlay() {
  var clusterGroup,
      map,
      data,
      cluster,
      svg,
      transform = d3.geo.transform({point: projectPoint}),
      path = d3.geo.path().projection(transform),
      line = d3.svg.line().x(function(d){ return d[0]}).y(function(d){return d[1]}).interpolate('basis-closed'),
      isolines;


  function _isolinesOverlay(_svg) {
    if(!data.length) return;
    svg = _svg;

    // DATA BINDING of container for all clusters
    clusterGroup = svg
      .selectAll('g.clusters-container')
      .data([data]);

    // ENTER container for all clusters
    clusterGroup
      .enter()
      .append('g')
      .classed('leaflet-zoom-hide', true)
      .classed('clusters-container', true);

    // DATA BINDING of clusters
    cluster = clusterGroup
      .selectAll('g.cluster')
      .data(function(clusters) { return clusters; });

    // ENTER clusters
    cluster
      .enter()
      .append('g')
      .classed('cluster', true)
      .on('click', function() {
        d3.event.stopPropagation();
      });

    // DATA BINDING isolines
    isolines = cluster
      .selectAll('path.isoline')
      .data(function(cluster) { 
        return cluster.features;
      });

    // ENTER isolines
    isolines
      .enter()
      .append('path')
      .classed('isoline', true);

    // EXIT isolines
    isolines
      .exit()
      .attr('opacity', 0)
      .remove();

    reset();
  }



  _isolinesOverlay.data = function(_data) {
    if(!arguments.length) return data;
    data = _data;
    return _isolinesOverlay;
  }

  _isolinesOverlay.map = function(_map) {
    if(!arguments.length) return map;
    !map && _map.on('viewreset', reset);
    map = _map;
    return _isolinesOverlay;
  }

  function projectFeature(feature) {
    return feature.geometry.coordinates[0].map(function(latLng) {
      var point = map.latLngToLayerPoint(new L.LatLng(latLng[0], latLng[1]))
      return [point.x, point.y]
    });
  }

  function projectPoint(x, y) {
    var point = map.latLngToLayerPoint(new L.LatLng(x, y));
    this.stream.point(point.x, point.y);
  }

  function getBounds(geoDataArray) {
    var top = Infinity,
        left = Infinity,
        bottom = -Infinity,
        right = -Infinity;

    geoDataArray.forEach(function(geoData) {
      var bounds = path.bounds(geoData);
      left = bounds[0][0] < left ? bounds[0][0] : left;
      top = bounds[0][1] < top ? bounds[0][1] : top;
      right = bounds[1][0] > right ? bounds[1][0] : right;
      bottom = bounds[1][1] > bottom ? bounds[1][1] : bottom;
    });

    return [[left, top], [right, bottom]];
  }

  function reset() {
    // only render stuff if there is actually some geometry
    if(data.length) {
      var bounds = getBounds(data),
          topLeft = bounds[0],
          bottomRight = bounds [1];

      svg
        .attr('width', bottomRight[0] - topLeft[0])
        .attr('height', bottomRight[1] - topLeft[1])
        .style('left', topLeft[0] + 'px')
        .style('top', topLeft[1] + 'px');

      clusterGroup.attr("transform", "translate(" + -topLeft[0] + "," + -topLeft[1] + ")");
      isolines.attr("d", function(d){ return line(projectFeature(d)); });
    }
  }

  return _isolinesOverlay;
}

module.exports = IsolinesOverlay;