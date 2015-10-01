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
      clusterEnter,
      isolineDefs, // path definisions
      outerMasksGroup,
      innerMasksGroup,
      dispatch = d3.dispatch(_isolinesOverlay, 'click:startlocation', 'mouseenter:cluster', 'mouseleave:cluster', 'mouseenter:isoline', 'mouseleave:isoline'),
      transform = d3.geo.transform({point: streamProjectPoint}),
      path = d3.geo.path().projection(transform), // only used for bounds calculation
      line = d3.svg.line()
        .x(function(d){ return d[0]})
        .y(function(d){return d[1]})
        .interpolate('basis-closed');


  function _isolinesOverlay(_svg) {

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
      .data(function(clusters) { 
        return clusters; 
      }, function(cluster) {
        // databinding for individual cluster
        return cluster.features[0].properties.startLocation.toString();
      });

    // ENTER clusters
    clusterEnter = cluster
      .enter()
      .append('g')
      .classed('m-clusters__cluster', true)
      .on('click', handleClickCluster)
      .on('mouseenter', handleMouseenterCluster)
      .on('mouseleave', handleMouseleaveCluster);

    createIsolineDefs();
    createOuterIsolineMasks();
    createInnerIsolineMasks();
    drawInnerMaskedIsolines();
    drawOuterMaskedIsolines();
    drawIsolines();
    drawStartLocation();
    resetContainers();

    cluster
      .exit()
      .remove();
  }


  function createIsolineDefs() {
    // DATA for defs per cluster
    var clusterDefs = clusterGroup
      .selectAll('defs.m-clusters__defs')
      .data(function(clusters) { return clusters; });

    // ENTER of clusters defs
    clusterDefs
      .enter()
      .append('svg:defs')
      .classed('m-clusters__defs', true);

    // DATA for isolines path
    isolineDefs = clusterDefs
      .selectAll('path.m-clusters__isoline-path')
      .data(function(cluster) {
        return cluster.features;
      });

    // ENTER of isolines path
    isolineDefs
      .enter()
      .append('svg:path')
      .classed('m-clusters__isoline-path', true);

    // UPDATE of isolines path
    isolineDefs
      .attr('id', createIsolineId)
      .attr('d', function(feature){
        return createDAttribute(projectIsoline(feature));
      });

    // EXIT of isolines path
    isolineDefs
      .exit()
      .remove();

    // EXIT of clusters defs
    clusterDefs
      .exit()
      .remove();
  }


  function createInnerIsolineMasks() {
    var innerMasks,
      innerMasksEnter;
    
    innerMasksGroup = clusterGroup
      .selectAll('g.m-cluster__inner-mask-group')
      .data(function(clusters) { 
        return clusters; 
      }, function(cluster) {
        // databinding for individual cluster
        return cluster.features[0].properties.startLocation.toString();
      });

    innerMasksGroup
      .enter()
      .append('g')
      .classed('m-cluster__inner-mask-group', true);

    innerMasks = innerMasksGroup
      .selectAll('mask.m-cluster__inner-mask')
      .data(function(cluster) { return cluster.features; });

    innerMasksEnter = innerMasks
      .enter()
      .append('svg:mask');


    innerMasks
      .attr('class', function(isoline) {
        return `m-cluster__inner-mask--${isoline.properties.travelMode}`
      })
      .classed('m-cluster__inner-mask', true)
      .attr('id', function(isoline) {
        return createInnerMaskId(isoline);
      });

    innerMasksEnter
      .append('rect') // ENTER  of one rect per mask
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('x', '0')
      .attr('y', '0')
      .attr('fill', '#fff');

    innerMasksEnter
      .append('use') // ENTER  of one rect per mask
      .classed('m-cluster__inner-mask-use', true);

    innerMasks
      .selectAll('use.m-cluster__inner-mask-use')
      .attr('xlink:href', function(isoline) {
        return `#${createIsolineId(isoline)}`;
      });

    innerMasks
      .exit()
      .remove();

    innerMasksGroup
      .exit()
      .remove();
  }


  function createOuterIsolineMasks() {
    // DATA for one group of masks per cluster
    outerMasksGroup = clusterGroup
      .selectAll('g.m-clusters__masks-group')
      .data(function(clusters) { return clusters; });

    // ENTER for one group of masks per cluster
    outerMasksGroup
      .enter()
      .append('g')
      .classed('m-clusters__masks-group', true);

    // UPDATE for one group of masks per cluster
    outerMasksGroup
      .each(function(cluster) {
        var maskData = getMaskData(cluster);

        // DATA for one mask per isoline grouping
        var masks = d3.select(this)
          .selectAll('mask.m-clusters__isolines-mask')
          .data(maskData);

        // ENTER for one mask per isoline grouping
        masks
          .enter()
          .append('svg:mask')
          .classed('m-clusters__isolines-mask', true)
          .append('rect') // ENTER  of one rect per mask
          .attr('width', '100%')
          .attr('height', '100%')
          .attr('x', '0')
          .attr('y', '0')
          .attr('fill', '#fff');

        // UPDATE of one mask per isoline grouping
        masks
          .attr('id', createOuterMaskId);

        // DATA for one use per isoline in isoline grouping
        var maskUses = masks
          .selectAll('use')
          .data(function(isolines) { return isolines; });


        // ENTER of one use per isoline in isoline grouping
        maskUses
          .enter()
          .append('svg:use');

        // UPDATE for one use per isoline in isoline grouping
        maskUses
          .attr('xlink:href', function(isoline) {
            return `#${createIsolineId(isoline)}`;
          });

        // EXIT for one use per isoline in isoline grouping
        maskUses
          .exit()
          .remove();

        // EXIT of one mask per isoline grouping
        masks
          .exit()
          .remove();
      });

    // EXIT for one group of masks per cluster
    outerMasksGroup
      .exit()
      .remove();
  }


  function drawIsolines() {
    // DATA for one use per isoline per cluster
    var isolines = cluster
      .selectAll('use.m-clusters__isoline--plain')
      .data(function(cluster) { 
        return cluster.features;
      });

    // ENTER for one use per isoline per cluster
    isolines
      .enter()
      .append('use');

    // UPDATE of one use per isoline per cluster
    isolines
      .attr('class', function(isoline) {
        return `m-clusters__isoline--${isoline.properties.travelMode}`;
      })
      .attr('xlink:href', function(isoline) {
        return `#${createIsolineId(isoline)}`;
      })
      .classed('m-clusters__isoline', true)
      .classed('m-clusters__isoline--plain', true)
      .on('mouseenter', handleMouseenterIsoline)
      .on('mouseleave', handleMouseleaveIsoline)
      .sort(function(isolineA, isolineB) {
        if(isolineA.properties.meanDistance > isolineB.properties.meanDistance)
          return -1;
        if(isolineA.properties.meanDistance < isolineB.properties.meanDistance)
          return 1;
        return 0;
      });

    // EXIT of one use per isoline per cluster
    isolines
      .exit()
      .attr('opacity', 0)
      .remove();
  }


  function drawOuterMaskedIsolines() {
    // UPDATE of clusters
    cluster
      .each(function(clusterData) {
        var maskData = getMaskData(clusterData),
            isolineMaskGroups = d3.select(this)
              .selectAll('use.m-clusters__isoline--masked-outer')
              .data(function(cluster) { return cluster.features; });

        isolineMaskGroups
          .enter()
          .append('use')

        isolineMaskGroups
          .attr('class', function(isoline) {
            return `m-clusters__isoline--${isoline.properties.travelMode}`;
          })
          .classed('m-clusters__isoline--masked-outer', true)
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
            if(!maskIsolines) return '';
            return `url(#${createOuterMaskId(maskIsolines)})`;
          });

        isolineMaskGroups
          .exit()
          .remove();
      });
  }


  function drawInnerMaskedIsolines() {

    // UPDATE of clusters
    cluster
      .each(function(clusterData) {
        var maskGroupData = getMaskData(clusterData),
            isolines,
            isolinesGroups = d3.select(this)
              .selectAll('g.m-clusters__masked-isoline-group')
              .data(function(cluster) { return cluster.features; });

        isolinesGroups
          .enter()
          .append('g')
          .classed('m-clusters__masked-isoline-group', true);

        // append masked isolines for each travelmode and mask them
        // with the other isolines 
        console.log(isolineData);
        isolinesGroups
          .each(function(isolineData) {
            var isolinesGroup = d3.select(this),
                maskData,
                isolines;

            maskData = _.find(maskGroupData, function(isolines) {
              return !_.any(isolines, function(maskIsoline) {
                return isolineData.properties.travelMode === maskIsoline.properties.travelMode;
              });
            });

            isolines = isolinesGroup
              .selectAll('use.m-clusters__isoline--masked-inner')
              .data(maskData);

            isolines
              .enter()
              .append('use');

            isolines
              .attr('class', function() {
                return `m-clusters__isoline--${isolineData.properties.travelMode}`;
              })
              .classed('m-clusters__isoline--masked-inner', true)
              .classed('m-clusters__isoline', true)
              .attr('xlink:href', function() {
                return `#${createIsolineId(isolineData)}`
              })
              .attr('mask', function(maskIsoline) {
                return `url(#${createInnerMaskId(maskIsoline)})`;
              });

            isolines
              .exit()
              .remove();
          });

        isolinesGroups
          .exit()
          .remove();
      });
  }


  function drawStartLocation() {
    clusterEnter
      .append('g')
      .attr('fill-rule', 'evenodd')
      .classed('m-clusters__start-location', true)
      .on('click', handleClickStartLocation)
      .append('path')
      .attr('d', 'M9,29 C9,29 18,14.1923177 18,9.14285714 C18,4.09339657 13.9705627,0 9,0 C4.02943725,0 0,4.09339657 0,9.14285714 C0,14.1923177 9,29 9,29 Z M9,13 C10.6568542,13 12,11.6568542 12,10 C12,8.34314575 10.6568542,7 9,7 C7.34314575,7 6,8.34314575 6,10 C6,11.6568542 7.34314575,13 9,13 Z');

    cluster
      .selectAll('g.m-clusters__start-location')
      .attr('transform', function(cluster) {
        var startLocation = cluster.features[0].properties.startLocation,
            projectedPoint = projectPoint(startLocation[0], startLocation[1]);
        return `translate(${projectedPoint[0] - 10}, ${projectedPoint[1] - 20})`
      });
  }



  /*
  * HANDLERS
  */

  function handleClickStartLocation(cluster, i) {
    d3.event.stopPropagation();
    dispatch['click:startlocation'](cluster, i);
  }


  function handleClickCluster(cluster, i) {
    d3.event.stopPropagation();
  }


  function handleMouseenterCluster(cluster, i) {
    dispatch['mouseenter:cluster'](cluster, i);
  }


  function handleMouseleaveCluster(cluster, i) {
    dispatch['mouseleave:cluster'](cluster, i); 
  }


  function handleMouseenterIsoline(isoline, i) {
    var element = d3.select(this),
        parent = d3.select(element.node().parentNode),
        clusterData = _.find(data, function(cluster){ 
          return _.isEqual(cluster.features[0].properties.startLocation, isoline.properties.startLocation);
        }),
        travelMode = isoline.properties.travelMode,
        start = isoline.properties.startLocation.toString(),
        maskData = clusterData && getMaskData(clusterData),
        wasHovered = element.classed('is-hovered'),
        maskIsolines = getMaskIsolines(maskData, isoline);


    // set secondary that are masked by hovered isolines to not-hovered
    _.forEach(maskIsolines, function(maskingIsoline) {
      var maskingTravelMode = maskingIsoline.properties.travelMode,
          maskingStart = maskingIsoline.properties.startLocation.toString();
      parent
        .selectAll(`use.m-clusters__isoline--masked-inner.m-clusters__isoline--${maskingTravelMode}`)
        .classed('is-not-hovered', true);

      parent
        .selectAll(`use.m-clusters__isoline--masked-inner[mask="url(#isoline__inner-mask__${travelMode}__${start})"]`)
        .classed('is-not-hovered', false);
    });

    // set all plain isolines to not-hovered
    parent
      .selectAll('use.m-clusters__isoline--plain')
      .classed('is-not-hovered', true);

    // set hovered to is-hovered
    element
      .classed('is-not-hovered', false)
      .classed('is-hovered', true);

    dispatch['mouseenter:isoline'](isoline, i);
  }


  function handleMouseleaveIsoline(isoline, i) {
    var element = d3.select(this),
        parent = d3.select(element.node().parentNode);

    // reset all hover classes
    parent
      .selectAll(`use.m-clusters__isoline--masked-inner`)
      .classed('is-not-hovered', false);

    parent
      .selectAll('use.m-clusters__isoline--plain')
      .classed('is-not-hovered', false)
      .classed('is-hovered', false);

    dispatch['mouseleave:isoline'](isoline, i);
  }


  /*
  * HELPERS
  */

  function createIsolineId(isoline) {
    return `isoline-def__${isoline.properties.travelMode}__${isoline.properties.startLocation.toString()}`;
  }


  function createOuterMaskId(isolines) {
    var modes = _.pluck(isolines, 'properties.travelMode').join('__');
    return `isoline-mask__${modes}__${isolines[0].properties.startLocation.toString()}`
  }

  function createInnerMaskId(isoline) {
    var travelMode = isoline.properties.travelMode,
        startLocation = isoline.properties.startLocation.toString();
    return `isoline__inner-mask__${travelMode}__${startLocation}`;
  }


  function getMaskData(cluster) {
    if(cluster.features.length <= 1) return [];
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


  /**
  * Returns the isolines data of the isolines that is not the isoline passed as parameter
  */
  function getMaskIsolines(maskData, isoline) {
    return _.find(maskData, function(isolines) {
      return !_.any(isolines, function(maskIsoline) {
        return isoline.properties.travelMode === maskIsoline.properties.travelMode;
      });
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

      outerMasksGroup
        .selectAll('rect')
        .attr('x', topLeft[0])
        .attr('y', topLeft[1]);

      innerMasksGroup
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


  /**
  * PUBLIC FUNCTIONS
  */

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

  return d3.rebind(_isolinesOverlay, dispatch, 'on');
}

module.exports = IsolinesOverlay;