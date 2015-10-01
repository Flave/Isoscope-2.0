var React = require('react'),
    LocationSearch = require('app/components/menu/LocationSearch.react'),
    ViewSettings = require('./ViewSettings.react'),
    Timelines = require('./Timelines.react'),
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
        <div className="m-ui-panel__group">
          <LocationSearch 
            state={this.props.state}
            handleTransition={this.props.handleTransition}/>
        </div>
        <div className="m-ui-panel__group">
          <ViewSettings 
            handleTransition={this.props.handleTransition}
            state={this.props.state} />
          <Timelines 
            isLoading={this.props.isLoading}
            clusters={this.props.clusters}
            state={this.props.state}
            handleTransition={this.props.handleTransition}/>
        </div>
      </div>
    )
  }
});

module.exports = UIPanel;