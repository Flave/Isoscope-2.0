var React = require('react'),
    ViewSettings = require('app/components/menu/ViewSettings.react'),
    LocationSearch = require('app/components/menu/LocationSearch.react'),
    _ = require('lodash'),
    Popover = require('app/components/common/Popover.react');


var Menu = React.createClass({
  getInitialState: function() {
    return {
        activeRef: 'search',
        timelineIsOpen: false
    }
  },

  handleToggle: function(e, ref) {
    if(this.state.activeRef === ref)
      this.setState({activeRef: ''});
    else
      this.setState({activeRef: ref});
  },

  handleTimelineTogle: function() {
    this.setState({timelineIsOpen: !this.state.timelineIsOpen});
  },

  render: function() {
    var timelineIsOpenClassName = this.props.isOpen ? 'is-active' : '';

    var changeFunction = function(ref) {
      return function(e) {
        this.handleToggle.call(this, e, ref);
      }.bind(this);
    }.bind(this);

    var triggers = _.map(['search', 'settings'], function(ref, i) {
      var activeClass = this.state.activeRef === ref ? 'is-active' : '';

      return (<button 
        key={i}
        ref={ref}
        onClick={changeFunction(ref)} 
        className={`menu-btn btn icon icon-${ref} ${activeClass}`}/>
        );
    }.bind(this));

    return (
      <div className={`${timelineIsOpenClassName} menu`}>

        <Popover 
          isActive={this.state.activeRef === 'search'}
          trigger={triggers[0]}>
          <div>
          </div>
          <LocationSearch
            state={this.props.state}  
            handleTransition={this.props.handleTransition}/>
        </Popover>

        <div onClick={this.props.handleDrawerToggle}>
          <button 
            ref="timeline"
            onClick={this.handleTimelineTogle}
            className={`menu-btn btn icon icon-timeline ${timelineIsOpenClassName}`}/>
        </div>

        <Popover 
          isActive={this.state.activeRef === 'settings'} 
          trigger={triggers[1]}>
          <ViewSettings
            state={this.props.state}  
            handleTransition={this.props.handleTransition}/>
        </Popover>
      </div>
    );
  }
});

module.exports = Menu;