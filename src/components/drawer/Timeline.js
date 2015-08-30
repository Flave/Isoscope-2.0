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
      .selectAll('g.m-timeline__lines')
      .data(function(clusters) { return [clusters]; });

    linesGroup
      .enter()
      .append('g')
      .attr('transform', `translate(${padding.left}, ${padding.top})`)
      .classed('m-timeline__lines', true);

    var lineElement = linesGroup
          .selectAll('path.m-timeline__line')
          .data(function(clusters) {
            // return [[23,432,123,44],[23,432,123,44]]
            var lineData = _.map(clusters, function(cluster) {
              return _.map(cluster.features, function(isoline) {
                return isoline.properties.meanDistance;
              })
            });
            return lineData;
          });

    lineElement
      .enter()
      .append('path')
      .classed('m-timeline__line', true);

    lineElement
      .attr('class', function(lineData, i) {
        return `m-timeline__line m-timeline__line--${data[i].properties.travelMode}`;
      })
      .attr('d', line);

    linesGroup
      .exit()
      .remove();
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
      .selectAll('g.m-timeline__axis--y')
      .data([1]);

    timeAxisContainer
      .enter()
      .append('g')
      .classed('m-timeline__axis--x m-timeline__axis', true)
      .attr('transform', `translate(${padding.left}, ${padding.top})`);

    timeAxis
      .tickPadding(20)
      .tickSize(-chartSize[1])
      .ticks([24]);;

    timeAxisContainer.call(timeAxis);

    // DISTANCE AXIS
    distanceAxis.scale(distance2Y);

    var distanceAxisContainer = svg
      .selectAll('g.m-timeline__axis--y')
      .data([1]);

    distanceAxisContainer
      .enter()
      .append('g')
      .classed('m-timeline__axis--y m-timeline__axis', true)
      .attr('transform', `translate(0, ${padding.top})`);

    distanceAxis
      .tickSize(-size[0])
      .ticks([5]);

    distanceAxisContainer
      .call(distanceAxis)
        .selectAll('text')
        .attr('x', 40)
        .attr('dy', -5);
  }

  return _timeline;
}

module.exports = Timeline;