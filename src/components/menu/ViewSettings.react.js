var React = require('react'),
    ReactSlider = require('react-slider'),
    classnames = require('classnames'),
    SegmentedControl = require('../common/SegmentedControl.react');

var daySegments = [
  {value: 0, label: 'MO'},
  {value: 1, label:'TU'},
  {value: 2, label: 'WE'},
  {value: 3, label: 'TH'},
  {value: 4, label: 'FR'},
  {value: 5, label: 'SA'},
  {value: 6, label: 'SO'}
]


var ViewSettings = React.createClass({
  handleTravelTimeChange: function(value) {
    this.props.handleTransition({travelTime: value});
  },

  handleDayChange: function(value, label, index) {
    this.props.handleTransition({weekday: value});
  },

  render: function() {
    var isOpenClassName = this.props.isOpen ? 'is-open' : '';
    var className = isOpenClassName + ' view-settings';

    return (
      <div ref="root" className='m-view-settings m-ui-panel__section'>
        <h3 className="m-ui-panel__section-title">Settings</h3>
        <div className="m-view-settings__group">
          <div className="m-view-settings__group-title">Travel Time</div>
          <div className="m-view-settings__group-input">
            <ReactSlider 
              min={2}
              max={30} 
              step={2}
              value={this.props.state.travelTime}
              onAfterChange={this.handleTravelTimeChange} 
              withBars={true}/>
          </div>
        </div>
        <div className="m-view-settings__group">
          <div className="m-view-settings__group-title">Day of the week</div>
          <div className="m-view-settings__group-input">
            <SegmentedControl
              name='travelMode'
              onChange={this.handleDayChange}
              selected={this.props.state.weekday}
              segments={daySegments} />
          </div>
        </div>
      </div>
    );
  }
});

module.exports = ViewSettings;