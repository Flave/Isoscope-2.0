var React = require('react'),
    Timeline = require('../drawer/Timeline.react'),
    _ = require('lodash'),
    d3 = require('d3');

var App = React.createClass({
  getInitialState: function() {
    return {}
  },
  getDefaultProps: function() {
    return {
      isOpen: true
    }
  },
  componentDidMount: function() {
    
  },

  render: function() {
    var clusters = _(this.props.clusters)
        .groupBy(function(cluster) {
          return cluster.properties.startLocation.toString();
        })
        .map(_.identity)
        .value(),
        maxDistance = d3.max(this.props.clusters, function(cluster) {
          return cluster.properties.maxDistance;
        }),
        timelines = _.map(clusters, function(cluster, i) {
          return <Timeline maxDistance={maxDistance} key={i} data={cluster} />
        });

    return (<div className='m-timelines'>
        {timelines}
      </div>)
  }
});

module.exports = App;
