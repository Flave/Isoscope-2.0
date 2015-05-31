var React = require('react'),
    ReactSlider = require('react-slider');


var ViewSettings = React.createClass({
  handleSettingsClick: function() {
    
  },

  handleTravelTimeChange: function(value) {
    console.log(arguments);
  },

  render: function() {
    var isOpenClassName = this.props.isOpen ? 'is-open' : '';
    var className = isOpenClassName + ' view-settings';

    return (
      <div className={className}>
        <ReactSlider min={0} max={300} step={1} onAfterChange={this.handleTravelTimeChange} withBars={true}/>
      </div>
    );
  }
});

module.exports = ViewSettings;