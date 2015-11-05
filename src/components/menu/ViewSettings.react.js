var React = require('react'),
    Slider = require('app/components/common/Slider.react'),
    d3 = require('d3'),
    _ = require('lodash'),
    classNames = require('classnames'),
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

  _handleTravelTimeAfterChange: function(value) {
    this.props.handleTransition({travelTime: value});
  },

  _handleTravelTimeChange: function(value) {
    this.setState({
      travelTime: value
    })
  },

  _handleDayChange: function(value, label, index) {
    this.props.handleTransition({weekday: value});
  },

  _handleTransportModeChange: function(value, label, index) {
    this.props.handleTransition({travelModes: value});
  },

  _handleLocationChange: function(location) {
    this.props.handleTransition({
      map: location.map
    });
  },

  render: function() {
    var isOpenClassName = this.props.isOpen ? 'is-open' : '';
    var className = isOpenClassName + ' view-settings';


    return (
      <div ref="root" className='m-view-settings m-ui-panel__section'>
        <h3 className="m-ui-panel__section-title">Settings</h3>
        <div className="m-view-settings__group">
          <div className="m-view-settings__group-title">
            Travel Time (minutes)
          </div>
          <div className="m-view-settings__group-input">
            <Slider 
              scale={d3.scale.linear().domain([2, 30]).clamp(true)}
              value={this.props.state.travelTime}
              height={40}
              tickValues={[2, 30]}
              onAfterChange={this._handleTravelTimeAfterChange}/>
          </div>
        </div>
        <div className="m-view-settings__group">
          <div className="m-view-settings__group-title">Day of the week</div>
          <div className="m-view-settings__group-input">
            <SegmentedControl
              name='weekday'
              onChange={this._handleDayChange}
              selected={this.props.state.weekday}
              segments={daySegments} />
          </div>
        </div>
        <div className="m-view-settings__group">
          <div className="m-view-settings__group-title">Means of Transportation</div>
          <div className="m-view-settings__group-input">
            <SegmentedMultiControl
              name='travelMode'
              onChange={this._handleTransportModeChange}
              selected={this.props.state.travelModes}
              segments={transportModeSegments} />
          </div>
        </div>
      </div>
    );
  }
});

module.exports = ViewSettings;