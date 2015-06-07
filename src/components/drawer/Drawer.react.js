var React = require('react'),
    Timeline = require('./Timeline');

var App = React.createClass({
  getInitialState: function() {
    return {
      timeline: Timeline()
    }
  },
  getDefaultProps: function() {
    return {
      isOpen: false
    }
  },
  componentDidMount: function() {
    this.updateTimeline();
  },

  componentDidUpdate: function() {
    this.updateTimeline();
  },

  updateTimeline: function() {
    var svgNode = this.refs.timelineCanvas.getDOMNode(),
        componentNode = this.getDOMNode(),
        size = [componentNode.offsetWidth, componentNode.offsetHeight],
        svg = d3.select(svgNode);

    this.state.timeline
      .data(this.props.clusters)
      .size(size)(svg);
  },

  render: function() {
    var isOpenClassName = this.props.isOpen ? 'is-open' : '';
    var className = isOpenClassName + ' drawer';

    return (<div className={className}>
        <svg ref="timelineCanvas"/>
      </div>)
  }
});

module.exports = App;