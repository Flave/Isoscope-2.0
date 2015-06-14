var React = require('react'),
    ReactSlider = require('react-slider'),
    SegmentedControl = require('../common/SegmentedControl.react');


var ViewSettings = React.createClass({
  handleSettingsClick: function() {
    
  },

  handleTravelTimeChange: function(value) {
    this.props.handleIsolinesSettingsChange({travelTime: value});
  },

  render: function() {
    var isOpenClassName = this.props.isOpen ? 'is-open' : '';
    var className = isOpenClassName + ' view-settings';

    return (
      <div className={className}>
        <ReactSlider min={0} max={30} step={2} onAfterChange={this.handleTravelTimeChange} withBars={true}/>
        <SegmentedControl items={[{value: 'car', label:'Car'}, {value: 'pdestrian', label:'Pedestrian'}]} />
      </div>
    );
  }
});

module.exports = ViewSettings;