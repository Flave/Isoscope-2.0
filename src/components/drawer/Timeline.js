var d3 = require('d3'),
    _ = require('lodash');


function Timeline() {
  var data, // geoJSONs of cluster
      size = [0, 0],
      padding = {top: 10, right: 10, bottom: 10, left: 10},
      chartSize = [size[0] - padding.right - padding.left, size[1] - padding.top - padding.bottom],
      hour2X = d3.scale.linear().domain([0, 23]),
      distance2Y = d3.scale.linear().nice(),
      maxDistance,
      svg,
      timeAxis = d3.svg.axis().orient('top'),
      distanceAxis = d3.svg.axis().orient('left'),
      line = d3.svg.line()
        .x(function(d, i){ return hour2X(i); })
        .y(function(d, i){ return distance2Y(d); })
        .interpolate('basis');


  function _timeline(_svg) {
    if(!data) return;
    svg = _svg;
    chartSize = [size[0] - padding.right - padding.left, size[1] - padding.top - padding.bottom];

    svg.attr({
      width: size[0],
      height: size[1]
    });

    updateScales();
    updateAxes();

    svg.datum(data);

    drawDots();
    drawLines();
  }

  function drawDots() {
    var isolineGroup = svg
      .selectAll('g.isoline')
      .data(function(cluster) {
        return cluster.features;
      });

    isolineGroup
      .enter()
      .append('g')
      .classed('isoline', true);

    isolineGroup.each(function(isoline, isolineIndex) {
      var dot = d3.select(this)
        .selectAll('circle.dot')
        .data(isoline.properties.distances);

      dot
        .enter()
        .append('circle')
        .classed('dot', true)
        .attr('r', 3);

      // ENTER + UPDATE dot
      dot
        .on('mouseover', function() {
          console.log(isoline);
        })
        .classed('is-above-average', function(distance, i) {
          if(distance > isoline.properties.meanDistance)
            return true;
        })
        .classed('is-below-average', function(distance, i) {
          if(distance < isoline.properties.meanDistance)
            return true;
        })
        .transition()
        .duration(500)
        .attr('cx', function(distance, i) {return hour2X(isolineIndex); })
        .attr('cy', function(distance) {return distance2Y(distance); });
    });
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

  _timeline.maxDistance = function(_) {
    if(!arguments.length) return maxDistance;
    maxDistance = _;
    return _timeline;
  }


  /*
  * Draws max, min and average lines
  */
  function drawLines() {
    var linesGroup = svg
      .selectAll('g.lines')
      .data(function(cluster) { return [cluster]; });

    linesGroup
      .enter()
      .append('g')
      .attr('transform', `translate(${padding.left}, ${padding.top})`)
      .classed('lines', true);

    drawLine(linesGroup, 'meanDistance', 'mean');
    drawLine(linesGroup, 'maxDistance', 'max');
    drawLine(linesGroup, 'minDistance', 'min');

    linesGroup
      .exit()
      .remove();
  }

  function drawLine(container, propertyName, className) {

    var lineElement = container
      .selectAll(`path.${className}`)
      .data(function(cluster) {
        return [cluster.features.map(function(isoline, i) {
          return isoline.properties[propertyName];
        })];     
      });


    lineElement
      .enter()
      .append('path')
      .classed(`${className} line`, true);

    lineElement
      .transition()
      .duration(500)
      .attr('d', line);
  }

  /*
  * Updates x and y scales
  */
  function updateScales() {
    hour2X.range([0, chartSize[0]]);
    distance2Y.domain([maxDistance, 0]).range([0, chartSize[1]]);
  }


  /*
  * Draws/Updates x and y axes
  */
  function updateAxes() {

    // TIME AXIS
    timeAxis.scale(hour2X);

    var timeAxisContainer = svg
      .selectAll('g.x-axis')
      .data([1]);

    timeAxisContainer
      .enter()
      .append('g')
      .classed('x-axis axis', true)
      .attr('transform', `translate(${padding.left}, ${padding.top})`);

    timeAxis
      .tickPadding(20)
      .tickSize(-chartSize[1])
      .ticks([24]);;

    timeAxisContainer.call(timeAxis);

    // DISTANCE AXIS
    distanceAxis.scale(distance2Y);

    var distanceAxisContainer = svg
      .selectAll('g.y-axis')
      .data([1]);

    distanceAxisContainer
      .enter()
      .append('g')
      .classed('y-axis axis', true)
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

  return _timeline;
}

module.exports = Timeline;