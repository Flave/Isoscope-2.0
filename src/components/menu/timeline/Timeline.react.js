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
        <div className="m-timeline__chart">
          <svg ref="timelineCanvas"/>
        </div>
        <div className="m-timeline__meta">Location Name <span>Street Name</span></div>
      </div>)
  }
});

module.exports = App;