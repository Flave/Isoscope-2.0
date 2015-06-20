var React = require('react'),
    ReactSlider = require('react-slider'),
    SegmentedControl = require('../common/SegmentedControl.react');


var ViewSettings = React.createClass({
  handleSettingsClick: function() {
    
  },

  handleTravelTimeChange: function(value) {
    this.props.handleTransition({travelTime: value});
  },

  handleTravelModeChange: function(value) {
    this.props.handleTransition({travelMode: value});
  },

  render: function() {
    var isOpenClassName = this.props.isOpen ? 'is-open' : '';
    var className = isOpenClassName + ' view-settings';

    return (
      <div className={className}>
        <div className="settings-group">
          <p className="title">Travel Time</p>
          <ReactSlider 
            min={2}
            max={30} 
            step={2}
            value={this.props.state.travelTime}
            onAfterChange={this.handleTravelTimeChange} 
            withBars={true}/>
        </div>
        <div className="settings-group">
          <p className="title">Travel Mode</p>
          <SegmentedControl
            name='travelMode'
            handleChange={this.handleTravelModeChange}
            value={this.props.state.travelMode}
            items={[{value: 'car', label:'Car'}, {value: 'pdestrian', label:'Pedestrian'}]} />
        </div>
      </div>
    );
  }
});

module.exports = ViewSettings;