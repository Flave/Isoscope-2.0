var ClusterConstants = require('../constants/ClusterConstants'),
    EventEmitter = require('events').EventEmitter,
    hereApi = require('../apis/here'),
    Q = require('q'),
    dispatcher = require('../dispatcher'),
    d3 = require('d3'),
    _ = require('lodash');

var CHANGE_EVENT = 'change';


/*
 Holds all the clusters as geoJSONs with structure:
[
  {
    startLocation: [lat, lng],
    id: someUID,
    clusters: [
      {
        type: "FeatureCollection",
        features: [
          {
            geometry: {coordinates: [isoline data]},
            properties:{
              travelTime, weekday...  
            }
          }
        ]
      }
    ]
  }
]
*/
var _clusters = [];


function add(config) {
  return hereApi.getCluster(config)
    .then(function(cluster) {
      _clusters.push(cluster);
    }, function(err) {
      console.log(err);
    });
}

/*
{
  viewPort: [[52.3, 13.1],[51.3, 13.18]]
}
*/
function load(options) {
  var promises;
  // 1. Group all clusters by start Location
  // 2. Get all clusters within viewport
  // 3. Check if there is a cluster with the specified configuration
  
  promises = _.chain(_clusters)
    // filter for clusters inside viewport
    .filter(function(cluster, key) {
      return true;
    })
    .groupBy(function(cluster) {
      var startLocation = cluster.properties.startLocation;
      return startLocation[0] + ',' + startLocation[1];
    })
    .map(function(clusterGroup, key) {
      // 1. check if ther is a cluster with config
      // 2. if so resolve promise with found cluster
      // 3. if not get cluster from api
      var deferred = Q.deferred();
      var cluster = _.findWhere(clusterGroup, {properties: options});

      if(!cluster)
        return hereApi.getCluster(options);

      deferred.resolve(cluster);
      return deferred.promise;
    }).value();

  return promises;
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


/**
* Calculates the reduced distance function of the isoline. Executes the reduceFunc function
* on the distance array of every isoline.
*/
function reduceDistancesOfIsolines(reduceFunc, propertyName) {
  _clusters.forEach(function(cluster) {
    cluster.features.forEach(function(isoline) {
      isoline.properties[propertyName] = reduceFunc(isoline.properties.distances);
    });
  });
}


/**
* Runs the reduceFunc over all the distances of all the isolines cluster
*/
function reduceDistancesOfClusters(reduceFunc, propertyName) {
  _clusters.forEach(function(cluster) {
    cluster.properties[propertyName] = reduceFunc(cluster.features, function(isoline) {
      return reduceFunc(isoline.properties.distances);
    });
  });
}



/**
* Calculates the extent of all the distances of all the isolines of all the clusters.
*/
function calculateDistanceExtent() {
  // get minDistance of all clusters
  distanceExtent[0] = d3.min(data, function(cluster) {
    return d3.min(cluster.features, function(isoline) {
      return d3.min(isoline.properties.distances);
    });
  });


  /**
  * Get maxDistance of all clusters
  */
  distanceExtent[1] = d3.max(data, function(cluster) {
    return d3.max(cluster.features, function(isoline) {
      return d3.max(isoline.properties.distances);
    });
  });
}

var ClustersStore = _.assign({}, EventEmitter.prototype, {

  get: function(settings) {
    return _.findWhere(_clusters, settings);
  },

  getAll: function() {
    return _clusters;
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
        add(action.data)
          .then(function() {
            calculateDistances();
            reduceDistancesOfIsolines(d3.mean, 'meanDistances');
            reduceDistancesOfIsolines(d3.max, 'maxDistances');
            reduceDistancesOfIsolines(d3.min, 'minDistances');
            reduceDistancesOfIsolines(d3.median, 'medianDistances');

            reduceDistancesOfClusters(d3.mean, 'meanDistance');
            reduceDistancesOfClusters(d3.max, 'maxDistance');
            reduceDistancesOfClusters(d3.min, 'minDistance');
            ClustersStore.emitChange();
          });
        break;
      case ClusterConstants.CLUSTER_LOAD:
        load(action.data);
        break;
      default:
        break;
    }

    return true;
  })
});

module.exports = ClustersStore;