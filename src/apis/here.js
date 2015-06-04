var jsonp = require('jsonp'),
    _ = require('lodash'),
    Q = require('q'),
    d3 = require('d3');

var api = {},
    app_id = 'bVQHRXUn6uNHP3B24bdt',
    app_code = 'mwkokcyyoCIfExsmQq0qIg',
    base = 'http://route.st.nlp.nokia.com/routing/6.2/calculateisoline.json';


/*
* @param {number} weekday - day of the week as number starting with 0
* @return {string} A date string with the format 2013-07-04T17:00:00+02
*/
function getXsDateTime(weekday, hourOfTheDay, timeZoneOffset) {
  var baseDate = '2015-04-',
      day = d3.format('02')(6 + weekday),
      hour = d3.format('02')(hourOfTheDay),
      time = `T${hour}:00:00`,
      timeZone;

  if(timeZoneOffset >= 0) {
    timeZone = '+' + d3.format('02')(timeZoneOffset) + ':00';        
  } else {
    timeZone = d3.format('03')(timeZoneOffset) + ':00';
  }

  return `${baseDate}${day}${time}${timeZone}`;
}

function JSON2QueryString(obj) {
  var str = [];
  _.forEach(obj, function(value, key) {
    str.push(encodeURIComponent(key) + "=" + encodeURIComponent(value));
  });

  return str.join("&");
}

function queryStringToJSON(queryString) {
  if(queryString.indexOf('?') > -1){
    queryString = queryString.split('?')[1];
  }
  var pairs = queryString.split('&');
  var result = {};
  pairs.forEach(function(pair) {
    pair = pair.split('=');
    result[pair[0]] = decodeURIComponent(pair[1] || '');
  });
  return result;
}

/*
* Converts weird here response "lat,lng" format to {lat: lat, lng:lng}
*/
function processIsolineValues(latLngValues) {
  return _.map(latLngValues, function(latLngValue) {
    var latLng = latLngValue.split(',');
    return [ parseFloat(latLng[0]), parseFloat(latLng[1]) ];
  });
}

/*
* Converts here responses to a more useful structure
* @return {object}  object
* @return {array}   object.data 
*/

function processIsolineResponse(res) {
  var isoline = res.Response.isolines[0];
  var meta = res.Response.MetaInfo;
  var params = queryStringToJSON(meta.RequestId);
  var isoline = {
    data: processIsolineValues(isoline.value)
  }

  // split startLocation paramter into array of lat/lng
  params.startLocation = params.startLocation.split(',');

  return _.assign({}, params, isoline);
}


/*
* PICK UP: 
*   - Find format for request id
*   - Include uid in request id
*   - Process request
*/

var hereApi = {
  /*
  * @param {string}   options.mode            (car|pedestrian)
  * @param {number}   options.weekday         number between 0 and 6
  * @param {number}   options.travelTime      number in minutes
  * @param {number}   options.hourOfDay       Hour of the day. number between 0 and 24
  * @param {number}   options.startLocation   [lat,lng]
  */
  get: function(options) {
    // requestId: start=lat,lng&mode=mode&weekday=weekday&hourOfDay=hourOfDay&travelTime=travelTime&
    var deferred = Q.defer();
    var params = JSON2QueryString({
      departure: getXsDateTime(0, 0, 0),
      mode: 'fastest;car;traffic:enabled',
      start: `${options.startLocation[0]},${options.startLocation[1]}`,
      time: 'PT0H02M',
      app_id: app_id,
      app_code: app_code,
      requestId: JSON2QueryString(options)
    });

    jsonp(`${base}?${params}`, {param: 'jsonCallback'}, function(err, res) {
      if(err)
        deferred.reject(error);
      else if(res.Details)
        deferred.reject(res);
      else
        deferred.resolve(processIsolineResponse(res));
    });

    return deferred.promise;
  }
}

module.exports = hereApi;