var ClusterConstants = require('../constants/ClusterConstants'),
    EventEmitter = require('events').EventEmitter,
    dispatcher = require('../dispatcher'),
    _ = require('lodash');

var CHANGE_EVENT = 'change';


/*
* Holds all the clusters as geoJSONs with structure:
* [
*   {
*     type: "FeatureCollection",
*     features: [
*       {
*         geometry: {coordinates: [isoline data]},
*         properties:{
*           travelTime, weekday...  
*         }
*       }
*     ]
*   }
* ]
*/
var _clusters = [];

function add(data) {
  //_clusters.push(data);
  _clusters[0] = data;
}

function calculateDistances() {
  _clusters.forEach(function(cluster) {
    var startLocation = cluster.properties.startLocation;
    cluster.features.forEach(function(isoline) {
      var points = isoline.geometry.coordinates[0];
      isoline.properties.distances = getDistances(startLocation, points);
    });
  });
}

function getDistances(startLocation, points) {
  var startLatLng = L.latLng([startLocation[0], startLocation[1]]);
  return points.map(function(point) {
    var latLng = L.latLng([point[0], point[1]]);
    return startLatLng.distanceTo(latLng);
  });
}

var ClustersStore = _.assign({}, EventEmitter.prototype, {

  get: function(settings) {
    return _.findWhere(_clusters, settings);
  },

  getAll: function() {
    return _clusters;
  },

  getAllAsGeoJSON: function() {
    return _clusters.map(function(cluster) {
      return {
        type: "FeatureCollection",
        features: cluster.isolines.map(function(isoline) {
          return {
            type: "Feature",
            properties: {},
            geometry: {
              type: "Polygon",
              coordinates: [isoline.data]
            }
          }
        })
      }
    });
  },

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  dispatcherIndex: dispatcher.register(function(payload) {
    var action = payload.action;
    switch(action.actionType) {
      case ClusterConstants.CLUSTER_ADD:
        add(action.data);
        calculateDistances();
        ClustersStore.emitChange();
        break;
      default:
        break;
    }

    return true;
  })
});

module.exports = ClustersStore;