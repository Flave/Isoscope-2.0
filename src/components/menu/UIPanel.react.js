var React = require('react'),
    LocationSearch = require('app/components/menu/LocationSearch.react'),
    ViewSettings = require('./ViewSettings.react'),
    TestPanel = require('./TestPanel.react'),
    Accordeon = require('./Accordeon.react'),
    _ = require('lodash');


var UIPanel = React.createClass({
  render: function() {

  var accordeonPanels = [
    {
      title: 'Settings',
      value: 'test',
      component: <ViewSettings 
        handleTransition={this.props.handleTransition}
        state={this.props.state} />
    },
    {
      title: 'Test',
      value: 'test',
      component: <TestPanel key={1}/>
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