var React = require('react'),
    LocationSearch = require('app/components/menu/LocationSearch.react'),
    ViewSettings = require('./ViewSettings.react'),
    Timelines = require('./Timelines.react'),
    TestPanel = require('./TestPanel.react'),
    Accordeon = require('app/components/common/Accordeon.react'),
    _ = require('lodash');


var UIPanel = React.createClass({
  render: function() {

  var accordeonPanels = [
    {
      title: 'Settings',
      value: 'settings',
      component: <ViewSettings 
        handleTransition={this.props.handleTransition}
        state={this.props.state} />
    },
    {
      title: 'Isolines',
      value: 'isolines',
      component: <Timelines 
        clusters={this.props.clusters}
        state={this.props.state}
        handleTransition={this.props.handleTransition}/>
    }
  ]

    return (
      <div className="m-ui-panel">
        <LocationSearch />
        <Accordeon panels={accordeonPanels}/>
      </div>
    )
  }
});

module.exports = UIPanel;