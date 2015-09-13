var d3 = require('d3'),
    L;

if(process.env.BROWSER) {
  L = require('leaflet');
}

function IsolinesOverlay() {
  var map,
      data,
      svg,
      clusterGroup,
      cluster, // g elements for clusters
      isolineDefs, // path definisions
      clusterMasks,
      transform = d3.geo.transform({point: streamProjectPoint}),
      path = d3.geo.path().projection(transform), // only used for bounds calculation
      line = d3.svg.line()
        .x(function(d){ return d[0]})
        .y(function(d){return d[1]})
        .interpolate('basis-closed');


  function _isolinesOverlay(_svg) {
    if(!data.length) return;
    svg = _svg;


    // DATA BINDING of container for all clusters
    clusterGroup = svg
      .selectAll('g.m-clusters')
      .data([data]);

    // ENTER container for all clusters
    clusterGroup
      .enter()
      .append('g')
      .classed('leaflet-zoom-hide', true)
      .classed('m-clusters', true);

    cluster = clusterGroup
      .selectAll('g.m-clusters__cluster')
      .data(function(clusters) { return clusters; });

    // ENTER clusters
    cluster
      .enter()
      .append('g')
      .classed('m-clusters__cluster', true)
      .on('click', function() {
        d3.event.stopPropagation();
      });

    createIsolineDefs();
    createIsolineMasks();
    drawMaskedIsolines();
    drawIsolines();
    resetContainers();
  }


  function createIsolineDefs() {

    // DATA BINDING of container for all clusters
    var clusterDefs = clusterGroup
      .selectAll('defs.m-clusters__defs')
      .data(function(clusters) { return clusters; });

    clusterDefs
      .enter()
      .append('svg:defs')
      .classed('m-clusters__defs', true);

    isolineDefs = clusterDefs
      .selectAll('path.m-clusters__isoline-path')
      .data(function(cluster) {
        return cluster.features;
      });

    isolineDefs
      .enter()
      .append('svg:path')
      .classed('m-clusters__isoline-path', true);

    isolineDefs
      .attr('id', createIsolineId)
      .attr('d', function(feature){
        return createDAttribute(projectIsoline(feature));
      });

    isolineDefs
      .exit()
      .remove();

    clusterDefs
      .exit()
      .remove();
  }


  function createIsolineMasks() {
    clusterMasks = clusterGroup
      .selectAll('g.m-clusters__masks-group')
      .data(function(clusters) { return clusters; });

    clusterMasks
      .enter()
      .append('g')
      .classed('m-clusters__masks-group', true);

    clusterMasks
      .each(function(cluster) {
        var maskData = getMaskData(cluster);

        var masks = d3.select(this)
          .selectAll('mask.m-clusters__isolines-mask')
          .data(maskData);

        masks
          .enter()
          .append('svg:mask')
          .classed('m-clusters__isolines-mask', true)
          .attr('id', createMaskId)
          .append('rect')
          .attr('width', '100%')
          .attr('height', '100%')
          .attr('x', '0')
          .attr('y', '0')
          .attr('fill', '#fff');

        var maskUses = masks
          .selectAll('use')
          .data(function(isolines) { return isolines; });

        maskUses
          .enter()
          .append('svg:use')
          .attr('xlink:href', function(isoline) {
            return `#${createIsolineId(isoline)}`;
          });
      });
  }


  function drawIsolines() {
    // DATA BINDING isolines
    var isolines = cluster
      .selectAll('use.m-clusters__isoline--plain')
      .data(function(cluster) { 
        return cluster.features;
      });

    // ENTER isolines
    isolines
      .enter()
      .append('use')
      .attr('class', function(isoline) {
        return `m-clusters__isoline--${isoline.properties.travelMode}`;
      })
      .attr('xlink:href', function(isoline) {
        return `#${createIsolineId(isoline)}`;
      })
      .classed('m-clusters__isoline', true)
      .classed('m-clusters__isoline--plain', true)
      .on('mouseover', function(isoline) {
        handleIsolineMouseover.call(this, isoline);
      })
      .on('mouseout', function(isoline) {

        d3.select(this)
          .classed('m-clusters__isoline--hovered');

        console.log(isoline.properties.travelMode);
      });

    // EXIT isolines
    isolines
      .exit()
      .attr('opacity', 0)
      .remove();
  }


  function drawMaskedIsolines() {
    // DATA BINDING of clusters
    cluster
      .each(function(clusterData) {
        var maskData = getMaskData(clusterData),
            isolineMaskGroups = d3.select(this)
              .selectAll('use.m-clusters__isoline--masked')
              .data(function(cluster) { return cluster.features; });

        isolineMaskGroups
          .enter()
          .append('use')
          .attr('class', function(isoline) {
            return `m-clusters__isoline--${isoline.properties.travelMode}`;
          })
          .classed('m-clusters__isoline--masked', true)
          .classed('m-clusters__isoline', true)
          .attr('xlink:href', function(isoline) {
            return `#${createIsolineId(isoline)}`
          })
          .attr('mask', function(isoline) {
            var maskIsolines = _.find(maskData, function(isolines) {
              return !_.any(isolines, function(maskIsoline) {
                return isoline.properties.travelMode === maskIsoline.properties.travelMode;
              });
            });
            return `url(#${createMaskId(maskIsolines)})`;
          });
      });
  }


  function handleIsolineMouseover(isoline) {
    d3
      .selectAll('use.m-clusters__isoline')
      .classed('is-in-background', true);
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


  function createIsolineId(isoline) {
    return `isoline-def__${isoline.properties.travelMode}__${isoline.properties.startLocation.toString()}`;
  }

  function createMaskId(isolines) {
    var modes = _.pluck(isolines, 'properties.travelMode').join('__');
    return `isoline-mask__${modes}__${isolines[0].properties.startLocation.toString()}`
  }


  function getMaskData(cluster) {
    return _.map(cluster.features, function(feature1, featureIndex1) {
      return _(cluster.features)
        .map(function(feature2, featureIndex2) {
        if(featureIndex1 !== featureIndex2)
          return feature2;
      })
      .compact()
      .value();
    });
  }


  function projectIsoline(feature) {
    return _(feature.geometry.coordinates)
      .map(function(polygon) {
        return _.map(polygon[0], function(latLng) {
          var point = map.latLngToLayerPoint(new L.LatLng(latLng[0], latLng[1]))
          return [point.x, point.y];
        });
      })
      .value();
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


  function createDAttribute(projectedIsoline) {
    return _(projectedIsoline)
      .reduce(function(dAttribute, polygon) {
        return dAttribute + line(polygon);
      }, '');
  }


  function pathTween(isoline) {
    var precision = 5,
        projectedIsoline = projectIsoline(isoline),
        d1 = createDAttribute(projectedIsoline),
        path0 = this,
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
        // .transition()
        // .duration(600)
        .attr('width', bottomRight[0] - topLeft[0])
        .attr('height', bottomRight[1] - topLeft[1])
        .style('left', topLeft[0] + 'px')
        .style('top', topLeft[1] + 'px');

      clusterGroup
        // .transition()
        // .duration(600)
        .attr("transform", "translate(" + -topLeft[0] + "," + -topLeft[1] + ")");

      clusterMasks
        .selectAll('rect')
        .attr('x', topLeft[0])
        .attr('y', topLeft[1]);
    }    
  }


  function resetDrawings() {
    // only render stuff if there is actually some geometry
    if(data.length) {
      // update isoline defs
      isolineDefs.attr('d', function(feature){
        return createDAttribute(projectIsoline(feature))
      });
    }
  }

  return _isolinesOverlay;
}

module.exports = IsolinesOverlay;