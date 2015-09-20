var React = require('react'),
    Timeline = require('./Timeline'),
    classNames = require('classnames');

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
    var locationInfo = this.props.data[0].properties.location,
        isHighlighted = this.props.state.hoveredCluster === this.props.data[0].properties.startLocation.toString();

    return (
      <div 
        style={style} 
        onClick={this._handleTimelineClick} 
        className={classNames('m-timeline', {'is-highlighted': isHighlighted})}>
        <div className="m-timeline__header">
          <span className="m-timeline__meta m-timeline__meta--primary">{locationInfo.city}, </span>
          <span className="m-timeline__meta m-timeline__meta--secondary">{locationInfo.address}</span>
          <button onClick={this._handleDeleteClick}>Delete</button>
        </div>
        <div className="m-timeline__chart">
          <svg ref="timelineCanvas"/>
        </div>
      </div>)
  },

  _handleTimelineClick: function(e) {
    var startLocation = this.props.data[0].properties.startLocation,
        mapState = [startLocation[0], startLocation[1], this.props.state.map[2]];
    
    this.props.handleTransition({map: mapState});
  },

  _handleDeleteClick: function(e) {
    e.stopPropagation();
    var startLocation = this.props.data[0].properties.startLocation;
    var clusters = _.filter(this.props.state.clusters, function(cluster) {
      return !((startLocation[0] == cluster[0]) && (startLocation[1] == cluster[1]));
    });
    this.props.handleTransition({clusters: clusters});
  },
});

module.exports = App;