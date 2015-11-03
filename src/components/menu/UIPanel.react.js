var React = require('react'),
    ViewSettings = require('./ViewSettings.react'),
    Timelines = require('./Timelines.react'),
    Accordeon = require('app/components/common/Accordeon.react'),
    Legend = require('./Legend.react'),
    _ = require('lodash');


var UIPanel = React.createClass({

  getInitialState: function() {
    return {
      legendIsExpanded: true
    }
  },

  componentDidMount: function() {
    this.updateDimensions()
  },

  componentDidUpdate: function() {
    this.updateDimensions();
  },

  updateDimensions: function() {
    var height = this.getDOMNode().getBoundingClientRect().height,
        settingsHeight = this.refs.viewSettings.getDOMNode().getBoundingClientRect().height,
        legendHeight = this.refs.legend.getDOMNode().getBoundingClientRect().height,
        timelinesHeight = height - settingsHeight - legendHeight;

    if(this.refs.timelines)
      this.refs.timelines.getDOMNode().setAttribute('style', `height:${timelinesHeight}px`);
  },

  _handleLegendToggle: function() {
    this.setState({legendIsExpanded: !this.state.legendIsExpanded});
  },

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
        {/*<Accordeon panels={accordeonPanels}/>*/}
        <div className="m-ui-panel__group">
          <ViewSettings
            ref="viewSettings" 
            handleTransition={this.props.handleTransition}
            state={this.props.state} />
          {this.props.state.clusters && this.props.state.clusters.length ?
            <Timelines 
              ref="timelines"
              isLoading={this.props.isLoading}
              clusters={this.props.clusters}
              state={this.props.state}
              handleTransition={this.props.handleTransition}/>
          : undefined}
          <Legend 
            isExpanded={this.state.legendIsExpanded}
            onToggle={this._handleLegendToggle}
            ref="legend"/>
        </div>
      </div>
    )
  }
});

module.exports = UIPanel;