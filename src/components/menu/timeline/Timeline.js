var d3 = require('d3'),
    _ = require('lodash');


function Timeline() {
  var data, // geoJSONs of cluster
      size = [0, 0],
      margin = {top: 0, right: 1, bottom: 0, left: 1},
      chartSize = [],
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
    chartSize = [size[0] - margin.right - margin.left, size[1] - margin.top - margin.bottom];

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
      .selectAll('g.m-timeline-chart__lines')
      .data(function(clusters) { return [clusters]; });

    linesGroup
      .enter()
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`)
      .classed('m-timeline-chart__lines', true);

    var lineElement = linesGroup
          .selectAll('path.m-timeline-chart__line')
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
      .classed('m-timeline-chart__line', true);

    lineElement
      .attr('class', function(lineData, i) {
        return `m-timeline-chart__line m-timeline-chart__line--${data[i].properties.travelMode}`;
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
      .selectAll('g.m-timeline-chart__axis--x')
      .data([1]);

    timeAxisContainer
      .enter()
      .append('g')
      .classed('m-timeline-chart__axis--x m-timeline-chart__axis', true)
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    timeAxis
      .tickValues([0, 6, 12, 18, 23])
      .tickFormat('')
      .tickSize(-chartSize[1]);

    timeAxisContainer.call(timeAxis);


    var distanceAxisContainer = svg
      .selectAll('g.m-timeline-chart__axis--y')
      .data([1]);

    distanceAxisContainer
      .enter()
      .append('g')
      .attr('transform', `translate(${chartSize[0] - 5}, 0)`)
      .classed('m-timeline-chart__axis--y m-timeline-chart__axis', true)
      .append('text');

    distanceAxisContainer
      .selectAll('text')
      .text(d3.round(distance2Y.domain()[0]/1000, 1) + " km");
  }

  return _timeline;
}

module.exports = Timeline;