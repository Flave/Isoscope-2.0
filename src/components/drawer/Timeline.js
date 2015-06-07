var d3 = require('d3'),
    _ = require('lodash'),
    L;

if(process.env.BROWSER) {
  L = require('leaflet');
}


function Timeline() {
  var data,
      size = [0, 0],
      padding = {top: 30, right: 30, bottom: 30, left: 30},
      chartSize = [size[0] - padding.right - padding.left, size[1] - padding.top - padding.bottom],
      hour2X = d3.scale.linear().domain([0, 23]),
      distance2Y = d3.scale.linear(),
      svg,
      distanceExtent = [];


  function _timeline(_svg) {
    console.log(data);
    if(!data || !data.length) return;
    svg = _svg;

    svg.attr({
      width: size[0],
      height: size[1]
    });

    chartSize = [size[0] - padding.right - padding.left, size[1] - padding.top - padding.bottom];

    calculateDistanceExtent();
    updateScales();

    var clustersGroup = svg
      .selectAll('g.tl__clusters-group')
      .data([data]);

    clustersGroup
      .enter()
      .append('g')
      .attr('transform', `translate(${padding.left}, ${padding.top})`)
      .classed('tl__clusters-group', true);

    var clusterGroup = clustersGroup
      .selectAll('g.tl__cluster-group')
      .data(function(clusters) { return clusters; });

    clusterGroup
      .enter()
      .append('g')
      .classed('tl__cluster-group', true);

    // Do .each so we have access to the whole cluster data inside event handlers
    clusterGroup.each(function(cluster, clusterIndex) {
      var isolineGroup = d3.select(this)
        .selectAll('g.tl__isoline-group')
        .data(cluster.features);

      isolineGroup
        .enter()
        .append('g')
        .classed('tl__isoline-group', true);

      // Do .each so we can get the index of the isoline to calculate x position
      isolineGroup.each(function(isoline, isolineIndex) {

        // DATA BINDING for dots
        var dots = d3.select(this)
          .selectAll('circle.tl__dot')
          .data(isoline.properties.distances);

        // UPDATE dots
        dots

        // ENTER dots
        dots
          .enter()
          .append('circle')
          .classed('tl__dot', true)
          .attr('r', 3)
          .attr('opacity', .1);

        // ENTER + UPDATE dots
        dots
          .attr('cx', function(distance, i) {return hour2X(isolineIndex); })
          .attr('cy', function(distance) {return chartSize[1] - distance2Y(distance); })
          .on('mouseover', function() {
            console.log(cluster);
          });

        // EXIT dots
        dots
          .exit()
          .remove();
      });
    });
  }

  _timeline.size = function(_) {
    if(!arguments.length) return size;
    size = _;
    return _timeline;
  }

  _timeline.data = function(_) {
    if(!arguments.length) return data;
    data = _;
    return _timeline;
  }

  _timeline.map = function(_) {
    if(!arguments.length) return map;
    map = _;
    return _timeline;
  }

  function updateScales() {
    hour2X.range([0, chartSize[0]]);
    distance2Y.domain([0, distanceExtent[1]]).range([0, chartSize[1]]);
  }

  function calculateDistanceExtent() {
    // get minDistance of all clusters
    distanceExtent[0] = d3.min(data, function(cluster) {
      return d3.min(cluster.features, function(isoline) {
        return d3.min(isoline.properties.distances);
      });
    });


    // get maxDistance of all clusters
    distanceExtent[1] = d3.max(data, function(cluster) {
      return d3.max(cluster.features, function(isoline) {
        return d3.max(isoline.properties.distances);
      });
    });
  }

  return _timeline;
}

module.exports = Timeline;