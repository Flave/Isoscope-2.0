var React = require('react'),
    LocationSearch = require('app/components/menu/LocationSearch.react'),
    classnames = require('classnames'),
    _ = require('lodash');


var Accordeon = React.createClass({
  getInitialState: function() {
    return {
      expandedPanels: undefined
    }
  },

  handleClick: function(panelIndex) {
    var expandedPanels = this.state.expandedPanels.slice();
    if(this.state.expandedPanels.indexOf(panelIndex) === -1) {
      expandedPanels.push(panelIndex);
    } else {
      var indexOf = expandedPanels.indexOf(panelIndex);
      expandedPanels.splice(indexOf, 1);
    }

    this.setState({expandedPanels: expandedPanels});
  },

  componentDidMount: function() {
    var expandedPanels = this.props.expandedPanels || [];
    this.setState({expandedPanels: expandedPanels});
  },

  render: function() {
    var expandedPanels = this.state.expandedPanels || _.range(this.props.panels.length);

    return (
      <div ref="mAccordeon" className="m-accordeon">
        {_.map(this.props.panels, function(panel, i) {
          return (
            <div key={i} className={classnames(
                'm-accordeon__panel',
                {'m-accordeon__panel--is-expanded': (expandedPanels.indexOf(i) !== -1)}
              )}>
              <div 
                onClick={this.handleClick.bind(this, i)}
                className='m-accordeon__panel-header'>
                {panel.title}
              </div>
              <div className='m-accordeon__panel-content'>
                {panel.component}
              </div>
            </div>
          );
        }.bind(this))}
      </div>
    )
  }
});

module.exports = Accordeon;