var React = require('react'),
    Timeline = require('./Timeline');

var style = {
  marginLeft: "-10px",
  padding: "10px"
}

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
        size = [componentNode.offsetWidth - 20, 80],
        svg = d3.select(svgNode);

    this.state.timeline
      .data(this.props.data)
      .maxDistance(this.props.maxDistance)
      .size(size)(svg);
  },

  render: function() {

    return (
      <div style={style} className="m-timeline">
        <div className="m-timeline__header">
          <span className="m-timeline__meta m-timeline__meta--primary">Location Name,</span>
          <span className="m-timeline__meta m-timeline__meta--secondary">Street Name</span>
        </div>
        <div className="m-timeline__chart">
          <svg ref="timelineCanvas"/>
        </div>
      </div>)
  }
});

module.exports = App;