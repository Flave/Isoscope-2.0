var React = require('react'),
    Timeline = require('./timeline/Timeline.react'),
    classNames = require('classnames'),
    Slider = require('app/components/common/Slider.react'),
    Legend = require('./Legend.react'),
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
          return <Timeline 
            maxDistance={maxDistance} 
            key={i} 
            state={this.props.state}
            handleTransition={this.props.handleTransition}
            data={cluster} />
        }, this);

    if(!timelines.length) return <div/>

    return (
      <div className='m-ui-panel__section m-ui-panel__section--timelines'>
        <h3 className="m-ui-panel__section-title">Distance Averages (M)</h3>
        <Slider 
          scale={d3.scale.linear().domain([0, 23]).clamp(true)}
          value={this.props.state.departureTime}
          height={40}
          tickValuesSuffix='00'
          modifiers={['timeline']}
          tickValues={[0, 6, 12, 18, 23]}
          onChange={this._handleDepartureTimeChange}/>
        <Legend/>
        <div className="m-timelines">
          {timelines}
        </div>
      </div>)
  },

  _handleDepartureTimeChange: function(value) {
    this.props.handleTransition({ departureTime: value });
  }
});

module.exports = App;
