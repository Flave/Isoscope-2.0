var React = require('react'),
    d3 = require('d3');

var Tooltip = React.createClass({
  getInitialState: function() {
    return {
      isHovered: false
    }
  },

  componentDidMount: function() {
    var el = d3.select(this.props.for)
      .on('mouseenter', this._handleMouseEnter)
      .on('mouseleave', this._handleMouseLeave);
    this.updateTooltip();
  },

  componentDidUpdate: function() {
    this.updateTooltip();
  },

  updateTooltip: function() {
    var el = d3.select(this.props.for).node(),
        elRect = el.getBoundingClientRect(),
        parentRect = el.parentNode.getBoundingClientRect(),
        top = elRect.top - parentRect.top,
        left = elRect.left - parentRect.left,
        tooltip = d3.select(this.getDOMNode()),
        tooltipRect = tooltip.node().getBoundingClientRect();

    tooltip
      .style('top', `${elRect.top - tooltipRect.height - 10}px`)
      .style('left', `${elRect.left + elRect.width/2 - tooltipRect.width/2}px`);
  },

  _handleMouseEnter: function() {
    this.setState({isHovered: true});
  },

  _handleMouseLeave: function() {
    this.setState({isHovered: false});
  },

  render: function() {
    if(this.state.isHovered) {
      return (
        <div className='m-tooltip'>
          {this.props.children}
        </div>
      )
    }

    return <div/>
  }
});

module.exports = Tooltip;