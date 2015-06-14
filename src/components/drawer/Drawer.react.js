var React = require('react'),
    Timeline = require('./Timeline.react');

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
    var isOpenClassName = this.props.isOpen ? 'is-open' : '';
    var className = isOpenClassName + ' drawer';
    var maxDistance = d3.max(this.props.clusters, function(cluster) {
      return cluster.properties.maxDistance;
    });


    var timelines = this.props.clusters.map(function(cluster, i) {
      return <Timeline maxDistance={maxDistance} key={i} data={cluster} />
    });

    return (<div className={className}>
        {timelines}
      </div>)
  }
});

module.exports = App;