var React = require('react'),
    Timeline = require('./Timeline');

var App = React.createClass({
  getInitialState: function() {
    return {
      timeline: Timeline()
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
      .data(this.props.data)
      .maxDistance(this.props.maxDistance)
      .size(size)(svg);
  },

  render: function() {

    return (<div className="timeline">
        <svg ref="timelineCanvas"/>
      </div>)
  }
});

module.exports = App;