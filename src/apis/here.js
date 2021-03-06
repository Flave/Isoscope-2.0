var jsonp = require('jsonp'),
    _ = require('lodash'),
    Q = require('q'),
    d3 = require('d3'),
    md5 = require('blueimp-md5'),
    util = require('app/utility').apiUtility;

var api = {},
    app_id = 'bVQHRXUn6uNHP3B24bdt',
    app_code = 'mwkokcyyoCIfExsmQq0qIg',
    base = 'https://isoline.route.cit.api.here.com/routing/7.2/calculateisoline.json';

/*
* Converts weird here response "lat,lng" format to {lat: lat, lng:lng}
* and eliminates douplicate coodinates included in the response
*/

function processIsolineValues(latLngValues) {
  var values = _.map(latLngValues, function(latLngValue, i) {
    var latLng = latLngValue.split(',');
    return [ parseFloat(latLng[0]), parseFloat(latLng[1]) ];
  });
  return _.compact(values);
}

/*
* Converts here responses to a more useful structure
* @return {object}  object
* @return {array}   object.data 
*/

function processIsolineResponse(res) {
  var isoline = res.response.isoline[0].component[0].shape,
      meta = res.response.metaInfo,
      params = _(util.queryStringToJSON(meta.requestId))
        .map(function(param, key) {
          var value;
          // split startLocation paramter into array of lat/lng
          if(key === 'startLocation')
            value = _.map(param.split(','), parseFloat);
          else
            value = isNaN(parseInt(param)) ? param : parseFloat(param);

          return [key, value];
        })
        .object()
        .value(),
      isoline = {
        data: processIsolineValues(isoline)
      },

    idConfig = {
      startLocation: params.startLocation,
      travelTime: params.travelTime,
      departureTime: params.departureTime,
      travelMode: params.travelMode,
      weekday: params.weekday
    };

    params.id = md5(JSON.stringify(idConfig));

  return _.assign({}, params, isoline);
}





var hereApi = {

  /**
  * Get a complete cluster of 
  *
  * @param  {string}    options.mode            (car|pedestrian)
  * @param  {number}    options.weekday         number between 0 and 6
  * @param  {number}    options.travelTime      number in minutes
  * @param  {number}    options.startLocation   [lat,lng]
  * @param  {array}     options.hoursOfDay      An array of hours which isolines should be loaded for
  * @return {promise}   promise                 A promise which resolves to the processed cluster
  */
  getClusters: function(options) {

    var promises = _(_.range(24))
      .map(function(hour) {
        return hereApi.getIsoline({
          travelMode: options.travelMode,
          travelTime: options.travelTime,
          departureTime: hour,
          weekday: options.weekday,
          startLocation: options.startLocation
        });
      })
      .value();


    return Q.all(promises)
      .spread(function() {
        var isolines = Array.prototype.slice.call(arguments);

        var geoJSON = {
          type: "FeatureCollection",
          properties: options,
          features: isolines.map(function(isoline) {
            return {
              geometry: {
                type: "MultiPolygon",
                coordinates: [
                  [isoline.data]
                ]
              },
              properties: _.omit(isoline, 'data')
            }
          })
        };
        return geoJSON;
      }, function(err) {
        console.log(err)
      }, function() {
        console.log('making progress');
      });
  },


  /**
  * Get an individual isoline 
  *
  * @param  {string}   options.mode            (car|pedestrian)
  * @param  {number}   options.weekday         number between 0 and 6
  * @param  {number}   options.travelTime      number in minutes
  * @param  {number}   options.departureTime   Hour of the day. number between 0 and 24
  * @param  {number}   options.startLocation   [lat,lng]
  * @return {promise}                          A promise which resolves to the processed isoline 
  *
  * TBD
  * - make departureTime generic to work with any date/time
  */
  getIsoline: function(options) {
    var deferred = Q.defer(),
        zeroPad2 = d3.format('02');

    var params = util.JSON2QueryString({
      departure: util.getXsDateTime(options.weekday, options.departureTime, 0), // = departureTime
      mode: `fastest;${options.travelMode};traffic:enabled`,
      start: `${options.startLocation[0]},${options.startLocation[1]}`,
      range: options.travelTime * 60, // = travelTime
      rangetype: "time",
      app_id: app_id,
      app_code: app_code,
      singlecomponent: true,
      resolution: 10,
      quality: 3,
      requestId: util.JSON2QueryString(options) // requestId: start=lat,lng&mode=mode&weekday=weekday&departureTime=departureTime&travelTime=travelTime&
    });

    jsonp(`${base}?${params}`, {param: 'jsonCallback'}, function(err, res) {
      if(err)
        deferred.reject(error);
      else if(res.Details)
        deferred.reject(res);
      else {
        deferred.resolve(processIsolineResponse(res));
      }
    });

    return deferred.promise;
  }
}

module.exports = hereApi;