var React = require('react'),
    Timeline = require('./Timeline'),
    ClusterActions = require('app/actions/ClusterActions'),
    classNames = require('classnames');

var style = {
/*  marginLeft: "-10px",
  padding: "10px"*/
}

var App = React.createClass({
  getInitialState: function() {
    return {
      timeline: Timeline(),
      isHighlighted: false
    }
  },
  componentDidMount: function() {
    this.updateTimeline();
  },

  componentDidUpdate: function() {
    this.updateTimeline();
  },


  componentWillReceiveProps: function(nextProps) {
    var isHighlighted = nextProps.state.hoveredCluster === nextProps.data[0].properties.startLocation.toString();

    this.setState({
      isHighlighted: isHighlighted
    });
  },


  updateTimeline: function() {
    var svgNode = this.refs.timelineCanvas.getDOMNode(),
        componentNode = this.getDOMNode(),
        size = [componentNode.offsetWidth - 20, 80],
        svg = d3.select(svgNode),
        highlightedLine = this.state.isHighlighted ? this.props.state.hoveredIsoline : undefined;

    this.state.timeline
      .data(this.props.data)
      .highlightLine(highlightedLine)
      .maxDistance(this.props.maxDistance)
      .cursorPosition(this.props.state.departureTime)
      .size(size)(svg);
  },

  render: function() {
    var locationInfo = this.props.data[0].properties.location;

    return (
      <div 
        style={style} 
        onClick={this._handleTimelineClick}
        onMouseEnter={this._handleMouseEnter}
        onMouseLeave={this._handleMouseLeave}
        className={classNames('m-timeline', {'is-highlighted': this.state.isHighlighted})}>
        <div className="m-timeline__header">
          <span className="m-timeline__meta m-timeline__meta--primary">{locationInfo.city}, </span>
          <span className="m-timeline__meta m-timeline__meta--secondary">{locationInfo.address}</span>
          <button className="m-timeline__delete" onClick={this._handleDeleteClick}>Delete</button>
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

    ClusterActions.remove(startLocation);
    this.props.handleTransition({
      clusters: clusters
    });
  },

  _handleMouseEnter: function() {
    var clusterLocation = this.props.data[0].properties.startLocation.toString();
    this.props.handleTransition({hoveredCluster: clusterLocation});
  },

  _handleMouseLeave: function() {
    this.props.handleTransition({hoveredCluster: undefined});
  }
});

module.exports = App;