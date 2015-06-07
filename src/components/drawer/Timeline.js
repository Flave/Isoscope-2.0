var d3 = require('d3'),
    _ = require('lodash'),
    L;

if(process.env.BROWSER) {
  L = require('leaflet');
}


function Timeline() {
  var data,
      size = [0, 0],
      padding = {top: 50, right: 25, bottom: 0, left: 60},
      chartSize = [size[0] - padding.right - padding.left, size[1] - padding.top - padding.bottom],
      hour2X = d3.scale.linear().domain([0, 23]),
      distance2Y = d3.scale.linear().nice(),
      svg,
      timeAxis = d3.svg.axis().orient('top'),
      distanceAxis = d3.svg.axis().orient('left'),
      line = d3.svg.line()
        .x(function(d, i){ return hour2X(i); })
        .y(function(d){ return distance2Y(d); })
        .interpolate('basis'),
      distanceExtent = [];


  function _timeline(_svg) {
    if(!data || !data.length) return;
    svg = _svg;
    chartSize = [size[0] - padding.right - padding.left, size[1] - padding.top - padding.bottom];

    svg.attr({
      width: size[0],
      height: size[1]
    });

    calculateDistanceExtent();
    updateScales();
    updateAxes();


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
          .on('mouseover', function() {
            console.log(cluster);
          })
          .transition()
          .duration(500)
          .attr('cx', function(distance, i) {return hour2X(isolineIndex); })
          .attr('cy', function(distance) {return distance2Y(distance); });

        // EXIT dots
        dots
          .exit()
          .remove();
      });
    });

    drawLines();
  }


  /*
  * Public functions for Timeline component
  */
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


  /*
  * Draws max, min and average lines
  */
  function drawLines() {
    var meanData = reduceDistances(data, d3.mean),
        maxData = reduceDistances(data, d3.max),
        minData = reduceDistances(data, d3.min);

    console.log(meanData);
    var linesGroup = svg
      .selectAll('g.tl__lines')
      .data([1]);

    linesGroup
      .enter()
      .append('g')
      .attr('transform', `translate(${padding.left}, ${padding.top})`)
      .classed('tl__lines', true);

    drawLine(linesGroup, meanData, 'mean', meanData);
    drawLine(linesGroup, maxData, 'max', meanData);
    drawLine(linesGroup, minData, 'min', meanData);
  }

  function drawLine(container, data, className, initialData) {
    initialData = initialData || data;

    var lineElement = container
      .selectAll(`path.tl__${className}`)
      .data(data);

    lineElement
      .enter()
      .append('path')
      /*.attr('d', line)*/
      .classed(`tl__${className} tl__line`, true);

    lineElement
      /*.data(data)*/
      .transition()
      .duration(500)
      .attr('d', line);
  }

  /*
  * Updates x and y scales
  */
  function updateScales() {
    hour2X.range([0, chartSize[0]]);
    distance2Y.domain([distanceExtent[1], 0]).range([0, chartSize[1]]);
  }


  /*
  * Draws/Updates x and y axes
  */
  function updateAxes() {

    // TIME AXIS
    timeAxis.scale(hour2X);

    var timeAxisContainer = svg
      .selectAll('g.tl__x-axis')
      .data([1]);

    timeAxisContainer
      .enter()
      .append('g')
      .classed('tl__x-axis tl__axis', true)
      .attr('transform', `translate(${padding.left}, ${padding.top})`);

    timeAxis
      .tickPadding(20)
      .tickSize(-chartSize[1])
      .ticks([24]);;

    timeAxisContainer.call(timeAxis);

    // DISTANCE AXIS
    distanceAxis.scale(distance2Y);

    var distanceAxisContainer = svg
      .selectAll('g.tl__y-axis')
      .data([1]);

    distanceAxisContainer
      .enter()
      .append('g')
      .classed('tl__y-axis tl__axis', true)
      .attr('transform', `translate(0, ${padding.top})`);

    distanceAxis
      .tickSize(-size[0])
      .ticks([5]);

    distanceAxisContainer
      .transition()
      .duration(500)
      .call(distanceAxis)
        .selectAll('text')
        .attr('x', 40)
        .attr('dy', -5);
  }

  /**
  * Returns an array of reduced distance function of the isoline. Executes the reduceFunc function
  * on the distance array of every isoline.
  */
  function reduceDistances(data, reduceFunc) {
    return data.map(function(cluster) {
      return cluster.features.map(function(isoline) {
        return reduceFunc(isoline.properties.distances);
      });
    });
  }


  /**
  * Calculates the extent of all the distances of all the isolines of all the clusters.
  */
  function calculateDistanceExtent() {
    // get minDistance of all clusters
    distanceExtent[0] = d3.min(data, function(cluster) {
      return d3.min(cluster.features, function(isoline) {
        return d3.min(isoline.properties.distances);
      });
    });


    /**
    * Get maxDistance of all clusters
    */
    distanceExtent[1] = d3.max(data, function(cluster) {
      return d3.max(cluster.features, function(isoline) {
        return d3.max(isoline.properties.distances);
      });
    });
  }

  return _timeline;
}

module.exports = Timeline;