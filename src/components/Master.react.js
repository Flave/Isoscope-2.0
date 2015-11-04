var React = require('react'),
    Map = require('./map/MapController.react'),
    UIPanel = require('./menu/UIPanel.react'),
    _ = require('lodash'),
    State = require('app/stores/StateStore'),
    classNames = require('classnames'),
    tourDates = require('app/config/tour'),
    TourManager = require('app/utility/tour-manager'),
    ClustersStore = require('app/stores/ClustersStore');

var tourManager;





function getClusters(config) {
  return ClustersStore.get(config);
};

function getState(config) {
  return State.get();
};

function isLoading(config) {
  return ClustersStore.isLoading();
};


var Component = React.createClass({
  contextTypes: {
    router: React.PropTypes.func.isRequired,
  },


  getInitialState: function() {
    return {
      state: getState(),
      isLoading: isLoading(),
      loadingStateChanged: false,
      clusters: []
    }
  },


  componentDidMount: function() {
    var query = this.context.router.getCurrentQuery();

    ClustersStore.addChangeListener(this._onStores);
    State.addChangeListener(this._onState);
    State.setFromUrl(query);

    setTimeout(function() {
      //tourManager = TourManager({tourDates: tourDates}).start();
    }, 2000);
  },

  componentWillReceiveProps: function(nextProps) {
    if(!this.state.isLoading) {
      this.setState({});
    }
  },

  _transitionTo: function(newState) {
    if(tourManager)
      tourManager.stop();
    State.set(newState);
  },


  _onState: function() {
    var routes = this.context.router.getCurrentRoutes(),
        params = this.context.router.getCurrentParams(),
        urlState = State.toUrl();

    this.setState({
      state: getState(),
      isLoading: isLoading(),
      loadingStateChanged: false
    });

    this.context.router.transitionTo(routes[routes.length - 1].path, params, urlState);
  },


  _onStores: function() {
    this.setState({
      isLoading: isLoading(),
      loadingStateChanged: true,
      clusters: getClusters(State.getClusterConfig())
    });
  },


  render: function() {
    return (
        <div className={classNames("controller-view", {"is-loading": this.state.isLoading})}>
          <Map
            state={this.state.state}
            clusters={this.state.clusters}
            isLoading={this.state.isLoading}
            loadingStateChanged={this.state.loadingStateChanged}
            handleTransition={this._transitionTo} />
          <UIPanel 
            state={this.state.state}
            clusters={this.state.clusters}
            isLoading={this.state.isLoading}
            handleTransition={this._transitionTo} />
          <div className="m-loading-indicator">
            <span className="m-loading-indicator__ant"></span>
            <span className="m-loading-indicator__ant"></span>
          </div>
        </div>
      )
  }
});

module.exports = Component;