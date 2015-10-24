var React = require('react'),
    ReactSlider = require('react-slider'),
    classnames = require('classnames'),
    SegmentedControl = require('../common/SegmentedControl.react'),
    SegmentedMultiControl = require('../common/SegmentedMultiControl.react');

var daySegments = [
  {value: 0, label: 'MO'},
  {value: 1, label:'TU'},
  {value: 2, label: 'WE'},
  {value: 3, label: 'TH'},
  {value: 4, label: 'FR'},
  {value: 5, label: 'SA'},
  {value: 6, label: 'SO'}
]

var transportModeSegments = [
  {value: 'car', label: 'Car'},
  {value: 'publicTransport', label: 'Public Transport'},
  {value: 'bike', label: 'Bike'}
]

var ViewSettings = React.createClass({
  getInitialState: function() {
    return {
      travelTime: 5
    }
  },

  componentWillReceiveProps: function(nextProps) {
    this.setState({
      travelTime: nextProps.state.travelTime
    })
  },

  handleTravelTimeAfterChange: function(value) {
    this.props.handleTransition({travelTime: value});
  },

  handleTravelTimeChange: function(value) {
    this.setState({
      travelTime: value
    })
  },

  handleDayChange: function(value, label, index) {
    this.props.handleTransition({weekday: value});
  },

  handleTransportModeChange: function(value, label, index) {
    this.props.handleTransition({travelModes: value});
  },

  render: function() {
    var isOpenClassName = this.props.isOpen ? 'is-open' : '';
    var className = isOpenClassName + ' view-settings';


    return (
      <div ref="root" className='m-view-settings m-ui-panel__section'>
        <h3 className="m-ui-panel__section-title">Settings</h3>
        <div className="m-view-settings__group">
          <div className="m-view-settings__group-title">
            Travel Time
            <div className="m-view-settings__group-value">{this.state.travelTime}</div>
          </div>
          <div className="m-view-settings__group-input">
            <ReactSlider 
              min={2}
              max={30} 
              step={2}
              value={this.state.travelTime}
              onChange={this.handleTravelTimeChange}
              onAfterChange={this.handleTravelTimeAfterChange}
              withBars={true}/>
          </div>
        </div>
        <div className="m-view-settings__group">
          <div className="m-view-settings__group-title">Day of the week</div>
          <div className="m-view-settings__group-input">
            <SegmentedControl
              name='weekday'
              onChange={this.handleDayChange}
              selected={this.props.state.weekday}
              segments={daySegments} />
          </div>
        </div>
        <div className="m-view-settings__group">
          <div className="m-view-settings__group-title">Day of the week</div>
          <div className="m-view-settings__group-input">
            <SegmentedMultiControl
              name='travelMode'
              onChange={this.handleTransportModeChange}
              selected={this.props.state.travelModes}
              segments={transportModeSegments} />
          </div>
        </div>
      </div>
    );
  }
});

module.exports = ViewSettings;