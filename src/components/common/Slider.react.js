var React = require('react'),
    d3 = require('d3'),
    _ = require('lodash'),
    classNames = require('classnames');

var patternLineStyle = {
  stroke: "#777" ,
  strokeWidth: ".75" ,
  fill: "transparent",
  strokeLinecap: "square"
}

var Slider = React.createClass({
  propTypes: {
    onChange: React.PropTypes.func,
    scale: React.PropTypes.func,
    value: React.PropTypes.number,
    height: React.PropTypes.number
  },

  getDefaultProps: function() {
    return {
      onChange: function() {},
      onAfterChange: function(){},
      segments: [],
      value: 0,
      scale: d3.scale.linear().range([0,1]).domain([0,1]),
      tickValues: undefined,
      tickValuesSuffix: '',
      xAxis: d3.svg.axis()
        .orient('top')
        .tickSize(3)
        .tickPadding(5),
      height: 30
    }
  },

  getInitialState: function() {
    return {
      width: 0
    }
  },

  componentWillMount: function() {
    this.brush = d3.svg.brush()
      .on('brush', this._handleBrush)
      .on('brushend', this._handleBrushEnd)
      .extent([0,0]);
  },

  componentDidMount: function() {
    var rootElement = this.getDOMNode(),
        rootWidth = rootElement.offsetWidth;

    this.setState({width: rootWidth});
    this.updateSlider();
    this.updateAxis();
  },

  componentDidUpdate: function() {
    this.updateSlider();
    this.updateAxis();
  },

  initSlider: function() {
    var slider = d3.select(this.refs.slider.getDOMNode())
      .call(this.brush);


    var handle = slider
        .attr("transform", "translate(0," + this.props.height / 2 + ")")
        .attr("r", 17)
        .attr("cx", this.props.scale(this.props.value));
  },

  updateSlider: function() {
    this.brush
      .x(this.props.scale)
      .extent([this.props.value, this.props.value]);

    var slider = d3.select(this.refs.slider.getDOMNode());

    slider
      .call(this.brush);

    slider.selectAll(".extent,.resize")
      .remove();

    slider.select(".background")
      .attr("height", this.props.height);

    var handle = slider
      .selectAll('g.handle')
      .data([1]);

    var handleEnter = handle
      .enter()
      .append("g")
      .attr("class", "handle");

    handleEnter
      .append('circle')
      .attr("r", 10);

    handleEnter
      .append('text')
      .classed('m-slider__handle-text', true)
      .attr('y', 28)
      .attr('x', -1);

    handle
      .selectAll('text.m-slider__handle-text')
      .text(this.props.value);


    if(this.props.tickValuesSuffix) {
      handleEnter
        .selectAll('text.m-slider__handle-text')
        .style('text-anchor', 'end');

      handleEnter
        .append('text')
        .classed('m-slider__handle-suffix', true)
        .attr('y', 26)
        .attr('x', 6)
        .text('00');
    }

    handle
      .attr("transform", `translate(${this.props.scale(this.props.value)},${this.props.height / 2})`);
  },


  updateAxis: function() {
    var xAxisElement = d3.select(this.refs.xAxis.getDOMNode());

    if(this.props.tickValues)
      this.props.xAxis.tickValues(this.props.tickValues);

    this.props.xAxis.scale(this.props.scale);
    xAxisElement.call(this.props.xAxis);

    var tickLabelDy = xAxisElement
      .selectAll('.tick text')
      .attr('dy');

    var tickLabelY = xAxisElement
      .selectAll('.tick text')
      .attr('y');

    if(this.props.tickValuesSuffix) {
      xAxisElement
        .selectAll('.tick text')
        .style('text-anchor', 'end');

      xAxisElement
        .selectAll('.tick')
        .selectAll('text.m-slider__axis-suffix')
        .data([1])
        .enter()
        .append('text')
        .classed('m-slider__axis-suffix', true)
        .text('00')
        .style('text-anchor', 'end')
        .attr('dy', tickLabelDy)
        .attr('y', tickLabelY - 3)
        .attr('x', 14);
    }
  },


  render: function() {
    this.props.scale.range([0, this.state.width]);

    return (
      <div className={classNames("m-slider", _.map(this.props.modifiers, function(m){ return `m-slider--${m}`}))}>
        <svg className="m-slider__svg" width={this.state.width} height={this.props.height}>
          <defs> 
            <pattern id="bg-pattern" patternUnits="userSpaceOnUse" width="7" height="7">
              <line x1="0" y1="7.5" x2="7.5" y2="0" style={patternLineStyle} />
              <line x1="0" y1="0.5" x2="0.5" y2="0" style={patternLineStyle} />
            </pattern> 
          </defs>
          <g
            className="m-slider__axis"
            transform='translate(0, 5)'
            ref="xAxis"/>
          <rect 
            ref="domain"
            className="m-slider__domain"
            transform={`translate(0, ${this.props.height/2 - 2})`}
            style={{fill: '#999'}}
            width={this.state.width} 
            height={1}/>
          <g ref="slider" className="m-slider__group"/>
        </svg>
      </div>
    )
  },

  _handleBrush: function() {
    var value = this._handleBrushChange();
    if (d3.event.sourceEvent) { // not a programmatic event
      this.props.onChange(value);
    }
  },

  _handleBrushEnd: function() {
    var value = this._handleBrushChange();
    if (d3.event.sourceEvent) { // not a programmatic event
      this.props.onAfterChange(value);
    }
  },

  _handleBrushChange: function() {
    var value,
        slider = d3.select(this.refs.slider.getDOMNode()),
        handle = slider.selectAll('.handle');

    if (d3.event.sourceEvent) { // not a programmatic event
      value = this.props.scale.invert(d3.mouse(this.refs.slider.getDOMNode())[0]);
      value = d3.round(value);
      this.brush.extent([value, value]);
    }

    handle
      .attr("transform", `translate(${this.props.scale(value)},${this.props.height / 2})`);

    handle
      .selectAll('text.m-slider__handle-text')
      .text(value);

    return value;
  }
})

module.exports = Slider;