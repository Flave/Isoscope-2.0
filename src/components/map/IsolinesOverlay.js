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
      transform = d3.geo.transform({point: streamProjectPoint}),
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

    drawIsolines();
  }

  function drawIsolines() {
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
      .selectAll('path.m-isoline')
      .data(function(cluster) { 
        return cluster.features;
      });

    // ENTER isolines
    isolines
      .enter()
      .append('path')
      .attr('class', function(isoline) {
        return `m-isoline--${isoline.properties.travelMode}`;
      })
      .classed('m-isoline', true)
      .attr('d', function(d) {
        var point = projectPoint(d.properties.startLocation[0], d.properties.startLocation[1]);
        return 'M' + point[0] + ',' + point[1];
      });

    isolines
      .transition()
      .duration(400)
      .delay(function(d, i) {
        return i * 80;
      })
      .attrTween('d', pathTween);

    // EXIT isolines
    isolines
      .exit()
      .attr('opacity', 0)
      .remove();

    resetContainers();
  }


  _isolinesOverlay.data = function(_data) {
    if(!arguments.length) return data;
    data = _data;
    return _isolinesOverlay;
  }

  _isolinesOverlay.map = function(_map) {
    if(!arguments.length) return map;
    !map && _map.on('viewreset', function() {
      resetContainers();
      resetDrawings();
    });
    map = _map;
    return _isolinesOverlay;
  }

  function projectIsoline(feature) {
    return feature.geometry.coordinates[0].map(function(latLng) {
      var point = map.latLngToLayerPoint(new L.LatLng(latLng[0], latLng[1]))
      return [point.x, point.y]
    });
  }

  function projectPoint(x, y)  {
    var point = map.latLngToLayerPoint(new L.LatLng(x, y))
    return [point.x, point.y];
  }

  function streamProjectPoint(x, y) {
    var point = map.latLngToLayerPoint(new L.LatLng(x, y));
    this.stream.point(point.x, point.y);
  }

  function projectDistance(distance) {
    var centerLatLng = map.getCenter();
    var centerPoint = map.latLngToLayerPoint(centerLatLng);
    var xPoint = [centerPoint.x + 1, centerPoint.y];
    var xLatLng = map.layerPointToLatLng(xPoint);
    var unitDistance = centerLatLng.distanceTo(xLatLng); // meters per pixel
    return distance / unitDistance;
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


//  function tween()

  function pathTween(isoline) {
    var precision = 5;

    var d1 = line(projectIsoline(isoline));
    var path0 = this,
        path1 = path0.cloneNode(),
        n0 = path0.getTotalLength(),
        n1 = (path1.setAttribute("d", d1), path1).getTotalLength();

    // Uniform sampling of distance based on specified precision.
    var distances = [0], 
        i = 0, 
        dt = precision / Math.max(n0, n1);

    while ((i += dt) < 1) distances.push(i);
    distances.push(1);

    // Compute point-interpolators at each distance.
    var points = distances.map(function(t) {
      var p0 = path0.getPointAtLength(t * n0),
          p1 = path1.getPointAtLength(t * n1);
      return d3.interpolate([p0.x, p0.y], [p1.x, p1.y]);
    });

    return function(t) {
      return t < 1 ? "M" + points.map(function(p) { return p(t); }).join("L") : d1;
    };
  }

  function resetContainers() {
    // only render stuff if there is actually some geometry
    if(data.length) {
      var bounds = getBounds(data),
          topLeft = bounds[0],
          bottomRight = bounds [1];

      svg
        .transition()
        .duration(400)
        .attr('width', bottomRight[0] - topLeft[0])
        .attr('height', bottomRight[1] - topLeft[1])
        .style('left', topLeft[0] + 'px')
        .style('top', topLeft[1] + 'px');

      clusterGroup
        .transition()
        .duration(400)
        .attr("transform", "translate(" + -topLeft[0] + "," + -topLeft[1] + ")");
    }    
  }

  function resetDrawings() {
    // only render stuff if there is actually some geometry
    if(data.length) {

      isolines.attr('d', function(isoline) {
        return line(projectIsoline(isoline));
      });
    }
  }

  return _isolinesOverlay;
}

module.exports = IsolinesOverlay;