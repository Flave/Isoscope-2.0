var React = require('react'),
    Timeline = require('./timeline/Timeline.react'),
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
    var maxDistance = d3.max(this.props.clusters, function(cluster) {
          return d3.max(cluster, function(modeCluster) {
            return modeCluster.properties.maxDistance;
          });
        }),
        timelines = _.map(this.props.clusters, function(cluster, i) {
          return <Timeline maxDistance={maxDistance} key={i} data={cluster} />
        });

    if(!timelines.length) return <div/>

    return (
      <div className='m-timelines m-ui-panel__section'>
        <h3 className="m-ui-panel__section-title">Distance Averages (M)</h3>
        <div>
          {timelines}
        </div>
      </div>)
  }
});

module.exports = App;
