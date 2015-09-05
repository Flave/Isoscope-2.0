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
        size = [componentNode.offsetWidth, 100],
        svg = d3.select(svgNode);

    this.state.timeline
      .data(this.props.data)
      .maxDistance(this.props.maxDistance)
      .size(size)(svg);
  },

  render: function() {

    return (
      <div className="m-cluster-timeline">
        <div className="m-cluster-timeline__meta"></div>
        <div className="m-cluster-timeline__chart">
          <svg ref="timelineCanvas"/>
        </div>
      </div>)
  }
});

module.exports = App;