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
      cursorPosition,
      linesGroup,
      linesGroupEnter,
      svg,
      highlightedLine,
      timeAxis = d3.svg.axis().orient('top'),
      distanceAxis = d3.svg.axis().orient('left'),
      dispatch = d3.dispatch(_timeline, 'mouseenter', 'mouseleave'),
      line = d3.svg.line()
        .x(function(feature, i){ return hour2X(i); })
        .y(function(feature, i){ return distance2Y(feature.properties.meanDistance); })
        .interpolate('basis'),
      area = d3.svg.area()
        .x(function(feature, i){ return hour2X(i)})
        .y0(function(feature, i){ return distance2Y(feature.properties.minDistance)})
        .y1(function(feature, i){ return distance2Y(feature.properties.maxDistance)})
        .interpolate('basis');


  function _timeline(_svg) {
    if(!data) return;
    svg = _svg;
    chartSize = [size[0] - margin.right - margin.left, size[1] - margin.top - margin.bottom];

    svg.attr({
      width: size[0],
      height: size[1]
    })
    .classed('m-timeline-chart', true)

    updateScales();
    updateAxes();

    svg.datum(data);

    linesGroup = svg
      .selectAll('g.m-timeline-chart__lines')
      .data(function(clusters) { return [clusters]; });

    linesGroupEnter = linesGroup
      .enter()
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`)
      .classed('m-timeline-chart__lines', true);

    drawAreas();
    drawLines();
    drawCursorLine();
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
      .attr('transform', `translate(5, 0)`)
      .classed('m-timeline-chart__axis--y m-timeline-chart__axis', true)
      .append('text');

    distanceAxisContainer
      .selectAll('text')
      .text(d3.round(distance2Y.domain()[0]/1000, 1) + " km");
  }

  /*
  * Draws max, min and average lines
  */
  function drawLines() {
    var lineElement = linesGroup
          .selectAll('path.m-timeline-chart__line')
          .data(function(clusters) {
            return _.pluck(clusters, 'features');
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
      .classed('m-timeline-chart__line', true)
      .on('mouseenter', handleMouseEnterLine)
      .on('mouseleave', handleMouseLeaveLine);

    lineElement
      .attr('class', function(lineData, i) {
        return `m-timeline-chart__line m-timeline-chart__line--${data[i].properties.travelMode}`;
      })
      .attr('d', line);

    lineElement
      .exit()
      .remove();

    linesGroup
      .exit()
      .remove();
  }


  function drawAreas() {
    var areas = linesGroup
      .selectAll('path.m-timeline-chart__area')
      .data(function(clusters) {
        return _.pluck(clusters, 'features');
      });

    areas
      .enter()
      .append('path')
      .classed('m-timeline-chart__area', true);

    areas
      .attr('class', function(features, i) {
        return `m-timeline-chart__area--${features[0].properties.travelMode}`
      })
      .classed('m-timeline-chart__area', true)
      .classed('is-hovered', function(features, i) {
        return highlightedLine === features[0].properties.travelMode;
      })
      .attr('d', area);
  }


  function drawCursorLine() {
    var cursorGroup = svg
      .selectAll('g.m-timeline-chart__cursor-group')
      .data([1]);

    var cursorGroupEnter = cursorGroup
      .enter()
      .append('g')
      .classed('m-timeline-chart__cursor-group', true);

    cursorGroup
      .attr('transform', `translate(${hour2X(cursorPosition)}, ${margin.top})`)

    var cursorLine = cursorGroupEnter
      .append('line')
      .classed('m-timeline-chart__cursor-line', true)

    cursorLine
      .attr('x1', 0)
      .attr('x2', 0)
      .attr('y1', 0)
      .attr('y2', chartSize[1]);

    cursorGroupEnter
      .append('rect')
      .classed('m-timeline-chart__cursor-background', true)
      .attr('width', 30)
      .attr('height', 20)
      .attr('fill', 'transparent')
      .attr('x', -15);

    var cursorDots = cursorGroup
      .selectAll('circle.m-timeline-chart__cursor-dot')
      .data(data);

    cursorDots
      .enter()
      .append('circle')
      .attr('r', 4)
      .attr('cx', 0)
      .classed('m-timeline-chart__cursor-dot', true);

    cursorGroup
      .selectAll('circle.m-timeline-chart__cursor-dot')
      .attr('cy', function(isolines) {
        var meanDistance = isolines.features[cursorPosition].properties.meanDistance;
        return distance2Y(meanDistance);
      })
      .attr('class', function(isolines) {
        return `m-timeline-chart__cursor-dot--${isolines.properties.travelMode}`;
      })
      .classed('m-timeline-chart__cursor-dot', true);

    cursorDots
      .exit()
      .remove();
  }


  function handleMouseEnterLine(features, i) {
    svg
      .selectAll(`.m-timeline-chart__area--${features[0].properties.travelMode}`)
      .classed('is-hovered', true);

    dispatch.mouseenter(features, i);
  }

  function handleMouseLeaveLine(features, i) {
    svg
      .selectAll(`.m-timeline-chart__area--${features[0].properties.travelMode}`)
      .classed('is-hovered', false);

    dispatch.mouseleave(features, i);
  }


  /*
  * Public functions for Timeline component
  */
  _timeline.size = function(_) {
    if(!arguments.length) return size;
    size = _;
    return _timeline;
  }

  _timeline.highlightLine = function(_) {
    if(!arguments.length) return highlightedLine;
    highlightedLine = _;
    return _timeline;
  }

  _timeline.data = function(_) {
    if(!arguments.length) return data;
    data = _;
    return _timeline;
  }

  _timeline.cursorPosition = function(_) {
    if(!arguments.length) return cursorPosition;
    cursorPosition = _;
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

  return d3.rebind(_timeline, dispatch, 'on');
}

module.exports = Timeline;