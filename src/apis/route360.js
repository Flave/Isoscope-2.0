var jsonp = require('jsonp'),
    _ = require('lodash'),
    L,
    util = require('app/utility').apiUtility,
    simplify = require('simplify-js'),
    Q = require('q');

var api = {},
    apiKey = 'PFHFE67HTWKLOR6R8QTI',
    base = 'http://api.route360.net/api_brandenburg/v1/polygon';

if(process.env.BROWSER) {
  L = require('leaflet');
}

function webMercatorToLatLng(point){
    var latlng = L.CRS.EPSG3857.projection.unproject(new L.Point(point.x /= 6378137, point.y /= 6378137));
    return [latlng.lat, latlng.lng];
};


/*
* Returns a geojson feature object for the polygons given
*
*/

function getIsolineGeoJSON(polygonsJson, options) {
    if ( polygonsJson.error ) return errorMessage;

    var coordinates,
        feature = { 
      type:"Feature", 
      geometry: { 
        type: "MultiPolygon" 
      }, 
      properties: options
    };

    if(polygonsJson[0]) {
      coordinates = _(polygonsJson[0].polygons)
        .map(function (polygonJson) {

            var pointsSimplified = simplify(polygonJson.outerBoundary, 340);
            var points = _(pointsSimplified)
              .map(function(point) {
                return webMercatorToLatLng({x: point[0], y: point[1]})
              })
              .compact()
              .value();

            return [points];
        })
        .value();
    }
    feature.geometry.coordinates = coordinates || [];

    return feature;
}


/*
* Create the api config object for the given options
*/
function createIsolineConfig(options) {
  var travelModeConfig;
  switch(options.travelMode) {
    case "publicTransport":
      travelModeConfig = {
        "transit":{
          "frame":{
            "time": options.departureTime * 360, // hour of the day in seconds
            "date": `201507${options.weekday + 20}`
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

function duplicateIsolines(isolines, wantedIsolines) {
  var duplicationRatio = isolines.length / wantedIsolines;
  return _(_.range(wantedIsolines))
    .map(function(wantedIndex) {
      var isolineIndex = Math.floor(wantedIndex * duplicationRatio),
          isoline = _.cloneDeep(isolines[isolineIndex]);
      isoline.properties.departureTime = wantedIndex;
      return isoline;
    })
    .value();
}

var route360Api = {

  getClusters: function(options) {
    var deferred = Q.defer(),
        wantedIsolines = 24,
        requestedIsolines = 8,
        promises = _(_.range(requestedIsolines))
          .map(function(hour) {
            return route360Api.getIsoline({
              travelMode: options.travelMode,
              travelTime: options.travelTime,
              departureTime: hour * (wantedIsolines/requestedIsolines),
              weekday: options.weekday,
              startLocation: options.startLocation
            })
          })
          .value();

    return Q.all(promises)
      .spread(function() {
        var receivedIsolines = Array.prototype.slice.call(arguments),
            isolines = duplicateIsolines(receivedIsolines, wantedIsolines);
            
        options.startLocation = _.map(options.startLocation, parseFloat)
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
          deferred.reject(err);
        else if(res.message)
          deferred.reject(res);
        else {
          deferred.resolve(getIsolineGeoJSON(res.data, options));
        }
      });

    return deferred.promise;
  }
}

module.exports = route360Api;    