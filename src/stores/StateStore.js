var ClusterActions = require('app/actions/ClusterActions'),
    ClustersStore = require('app/stores/ClustersStore'),
    EventEmitter = require('events').EventEmitter,
    dispatcher = require('../dispatcher'),
    Q = require('q'),
    _ = require('lodash');


var CHANGE_EVENT = 'change',
    _defaultState = {
      map: [52.5,13.4,12],
      clusters: [],
      departureTime: 0,
      weekday: 0,
      travelModes: ['car', 'publicTransport', 'bike'],
      travelTime: 6,
      hoveredCluster: undefined,
      hoveredIsoline: undefined
    },
    _state = _.clone(_defaultState),
    _urlState = {},
    _urlKeys = [
      'map',
      'clusters',
      'departureTime',
      'weekday',
      'travelModes',
      'travelTime'
    ],
    _clusterKeys = [
      'clusters',
      'weekday',
      'travelTime',
      'travelModes'
    ]


var config = {
  stateParseFunctions: {
    'clusters': function(clusters) {
      if(!clusters) return undefined;
      return _(clusters.split(','))
        .groupBy(function(coordinate, i){
          return Math.floor(i/2);
        })
        .map(function(val, key) {
          return val;
        })
        .value();
    },
    'map': function(mapParams) {
      if(!mapParams) return undefined;
      var params = _.map(mapParams.split(','), parseFloat);
      return params;
    },
    'travelModes': function(travelModes) {
      if(!travelModes) return undefined;
      var order = ['car', 'bike', 'publicTransport'];
      var parsedTravelModes = travelModes.split(',');

      return travelModes = _(order)
        .map(function(travelMode) {
          var index = parsedTravelModes.indexOf(travelMode)
          return index === -1 ? undefined : travelMode;
        })
        .compact()
        .value();
    }
  },
  stateComposeFunctions: {
    'clusters': function(clusters) {
      if(!clusters) return undefined;
      return clusters.join(',');
    },
    'map': function(mapParams) {
      if(!mapParams) return undefined;
      return mapParams.join(',');
    },
    'travelModes': function(travelModes) {
      if(!travelModes) return undefined;
      return travelModes.join(',');
    }
  }
}


function set(values) {
  var newState = _.assign({}, _defaultState, _state, values),
      newUrlState = _.assign({}, _urlState, _.pick(values, _clusterKeys));

  _state = newState;
  _urlState = newUrlState;

  // clusters shouldn't be undefined otherwise we have to check for that later on
  if(!_state.clusters) _state.clusters = [];

  // check if a property that requires a update of clusters has changed and update accordingly
  var clustersNeedUpdate = _.any(values, function(value, key) {
    return _clusterKeys.indexOf(key) !== -1;
  });
  if(clustersNeedUpdate) update();
}


function update() {
  ClusterActions.update(getClusterConfig());
}


function getClusterConfig() {
  return _.pick(_state, _clusterKeys);
  //... also check if startLocations fall into map bounds
}


function fromUrl(urlState) {
  _urlState = _(_urlKeys)
    // parse individual query parameters according to their parse function
    .map(function(urlKey) {
      var param,
          parseFunction = config.stateParseFunctions[urlKey],
          kebabCaseKey = _.kebabCase(urlKey),
          value = urlState[kebabCaseKey];

      if(!value) return undefined;

      if(parseFunction)
        param = parseFunction(value);
      else
        param = /^\d+$/.test(value) ? parseFloat(value) : value;

      return [urlKey, param];
    })
    .compact()
    .object()
    .value();

  set(_urlState);
}


var ClustersStore = _.assign({}, EventEmitter.prototype, {

  toUrl: function() {
    return _(_urlState)
      .map(function(value, key) {
        var kebabCaseKey = _.kebabCase(key),
            composeFunction = config.stateComposeFunctions[key] || function(param){return param + ''};

        return [kebabCaseKey, composeFunction(value)];
      })
      .object()
      .value();
  },

  get: function() {
    return _state;
  },

  /**
  * Returns the state necessary to retrieve clusters
  */
  getClusterConfig: function() {
    return getClusterConfig();
  },

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  set: function(values) {
    set(values);
    this.emitChange();
  },

  setFromUrl: function(urlState) {
    fromUrl(urlState);
    this.emitChange();
  },

  removeCluster: function() {

  },

  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }
});

ClustersStore.addChangeListener(function() {
  
});

module.exports = ClustersStore;