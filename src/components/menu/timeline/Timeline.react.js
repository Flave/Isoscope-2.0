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
      .cursorPosition(this.props.state.departureTime)
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
  },

  _handleDeleteClick: function(e) {
    console.log(this.props.data);
    var startLocation = this.props.data[0].properties.startLocation;
    var clusters = _.filter(this.props.state.clusters, function(cluster) {

      return !((startLocation[0] == cluster[0]) && (startLocation[1] == cluster[1]));
    });
    this.props.handleTransition({clusters: clusters});
  },
});

module.exports = App;