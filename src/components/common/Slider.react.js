var React = require('react'),
    d3 = require('d3'),
    classnames = require('classnames');

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
      segments: [],
      value: 0,
      scale: d3.scale.linear().range([0,1]).domain([0,1]),
      xAxis: d3.svg.axis()
        .tickValues([0, 6, 12, 18, 23])
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
        .attr("r", 20)
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
      .attr("r", 12);

    handleEnter
      .append('text')
      .classed('m-slider__handle-text', true)
      .attr('y', 30)
      .attr('x', -1)
      .text(this.props.value);

    handleEnter
      .append('text')
      .classed('m-slider__handle-suffix', true)
      .attr('y', 26)
      .attr('x', 7)
      .text('00');

    handle
      .attr("transform", `translate(${this.props.scale(this.props.value)},${this.props.height / 2})`);
  },


  updateAxis: function() {
    var xAxisElement = d3.select(this.refs.xAxis.getDOMNode());

    this.props.xAxis.scale(this.props.scale);
    xAxisElement.call(this.props.xAxis);

    var tickLabelDy = xAxisElement
      .selectAll('.tick text')
      .attr('dy');

    var tickLabelY = xAxisElement
      .selectAll('.tick text')
      .attr('y');

    xAxisElement
      .selectAll('.tick')
      .selectAll('text.m-slider__axis-suffix')
      .data([1])
      .enter()
      .append('text')
      .classed('m-slider__axis-suffix', true)
      .text('00')
      .attr('dy', tickLabelDy)
      .attr('y', tickLabelY)
      .attr('x', 13);
  },


  render: function() {
    this.props.scale.range([0, this.state.width]);

    return (
      <div className="m-slider">
        <svg className="m-slider__svg" width={this.state.width} height={this.props.height}>
          <defs> 
            <pattern id="bg-pattern" patternUnits="userSpaceOnUse" width="7" height="7">
              <line x1="0" y1="7.5" x2="7.5" y2="0" style={patternLineStyle} />
              <line x1="0" y1="0.5" x2="0.5" y2="0" style={patternLineStyle} />
            </pattern> 
          </defs>
          <g
            className="m-slider__axis"
            ref="xAxis"/>
          <rect 
            ref="domain"
            transform={`translate(0, ${this.props.height/2 - 2})`}
            style={{fill: 'url(#bg-pattern) transparent'}} 
            width={this.state.width} 
            height={4}/>
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
      this.props.onChange(value);
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