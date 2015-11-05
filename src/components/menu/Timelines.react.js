var React = require('react'),
    Timeline = require('./timeline/Timeline.react'),
    classNames = require('classnames'),
    Slider = require('app/components/common/Slider.react'),
    Legend = require('./Legend.react'),
    _ = require('lodash'),
    d3 = require('d3');

var App = React.createClass({
  getInitialState: function() {
    return {
      isScrolled: false
    }
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
        <div className='m-ui-panel__section-header'>
          <h3 className="m-ui-panel__section-title">Distances</h3>
          <Slider 
            scale={d3.scale.linear().domain([0, 23]).clamp(true)}
            value={this.props.state.departureTime}
            height={40}
            tickValuesSuffix='00'
            modifiers={['timeline']}
            tickValues={[0, 6, 12, 18, 23]}
            onChange={this._handleDepartureTimeChange}/>
        </div>
        <div className="m-timelines">
          <div className={classNames("m-timelines__inner", {'is-scrolled': this.state.isScrolled})} 
            onScroll={this._handleScroll}>
            {timelines}
          </div>
        </div>
      </div>)
  },

  _handleScroll: function(e) {
    if(!this.state.isScrolled && e.target.scrollTop > 0)
      this.setState({isScrolled: true});
    else if(e.target.scrollTop === 0)
      this.setState({isScrolled: false});
  },

  _handleDepartureTimeChange: function(value) {
    this.props.handleTransition({ departureTime: value });
  }
});

module.exports = App;
