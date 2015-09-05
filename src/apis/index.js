var here = require('./here'),
    route360 = require('./route360');


var api = {};

var travelModeApis = {
  car: here,
  publicTransport: route360,
  bike: route360,
  truck: here,
  pedestrian: here
}


/**
* @param {object} config                The configuration for requesting isolines
* @param {array} config.travelModes     An array of travelmodes
* @param {number} config.departureDay   The day of departure specified as a number from 0 to 6
* @param {array} config.startLocation   The coordinates of the start location as an array of [lat,lng]
* @param {number} config.travelTime     The duration of traveling specified as number in minutes
*/

api.get = function(config) {
  var travelModeApi = travelModeApis[config.travelMode];
  console.log('fetching clusters for ' + config.travelMode);
  return travelModeApi.getClusters(config);
}


module.exports = api;