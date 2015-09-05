var jsonp = require('jsonp'),
    _ = require('lodash'),
    L,
    util = require('../utility'),
    Q = require('q');

var api = {},
    apiKey = 'PFHFE67HTWKLOR6R8QTI',
    base = 'http://api.route360.net/api_dev/v1/polygon';

if(process.env.BROWSER) {
  L = require('leaflet');
}

function webMercatorToLatLng(point){
    var latlng = L.CRS.EPSG3857.projection.unproject(new L.Point(point.x /= 6378137, point.y /= 6378137));
    return [latlng.lat, latlng.lng];
};


function processPolygons(polygonsJson, options) {
           
    if ( polygonsJson.error ) return errorMessage;

    var feature = { 
      type:"Feature", 
      geometry: { 
        type: "MultiPolygon" 
      }, 
      properties: options
    };

    var coordinates = _(polygonsJson[0].polygons)
      .map(function (polygonJson) {
          var points = _(polygonJson.outerBoundary)
            .map(function(point) {
              return webMercatorToLatLng({x: point[0], y: point[1]})
            })
            .value();

          return [points];
      })
      .value();
    feature.geometry.coordinates = coordinates;
    return feature;
}

function createIsolineConfig(options) {
  var travelModeConfig;
  switch(options.travelMode) {
    case "publicTransport":
      travelModeConfig = {
        "transit":{
          "frame":{
            "time": options.departureTime * 360, // hour of the day in seconds
            "date": `201504${options.weekday + 6}`
          }
        }
      }
      break;
    case "bike":
      travelModeConfig = { "bike": {} };
      break;
    default:
      break;
  }

  return {
    "sources":[
      {
        "lat": options.startLocation[0],
        "lng": options.startLocation[1],
        "id":"le-id",
        "tm": travelModeConfig
      }
    ],
    "polygon":{
      "values":[options.travelTime * 60]
    }
  };
}

var route360Api = {


  getClusters: function(options) {
    var deferred = Q.defer();
    var promises = _(_.range(24))
      .map(function(hour) {
        return route360Api.getIsoline({
          travelMode: options.travelMode,
          travelTime: options.travelTime,
          departureTime: hour,
          weekday: options.weekday,
          startLocation: options.startLocation
        })
      })
      .value();

    return Q.all(promises)
      .spread(function() {
        var isolines = Array.prototype.slice.call(arguments);
        return {
            type: "FeatureCollection",
            properties: options,
            features: isolines
          };
      }, function(err) {
        console.log(err);
      });
  },

  getIsoline: function(options) {
    var config = createIsolineConfig(options),
        params,
        deferred = Q.defer();

    params = util.JSON2QueryString({
      cfg: JSON.stringify(config),
      key: apiKey,
      message: 'something',
      id: 'some-id'
    });

    jsonp(`${base}?${params}`, {param: 'cb'}, function(err, res) {
      if(err)
        deferred.reject(error);
      else if(res.Details)
        deferred.reject(res);
      else {
        deferred.resolve(processPolygons(res.data, options));
      }
    });

    return deferred.promise;
  }
}

module.exports = route360Api;    