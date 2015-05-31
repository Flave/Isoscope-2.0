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

function serializeObject(obj) {
  var str = [];
  _.forEach(obj, function(value, key) {
    str.push(encodeURIComponent(key) + "=" + encodeURIComponent(value));
  });

  return str.join("&");
}

var hereApi = {
  /*
  * @param {string} options.mode (car|pedestrian)
  * @param {number} options.weekday number between 0 and 6
  * @param {}
  */
  get: function(options) {
    var params = serializeObject({
      departure: getXsDateTime(0, 0, 0),
      mode: 'fastest;car;traffic:enabled',
      start: '52.5160,13.3778',
      time: 'PT0H05M',
      app_id: app_id,
      app_code: app_code
    });

    jsonp(`${base}?${params}`, {param: 'jsonCallback'}, function(err, res) {
      console.log(res);

    });
  }
}

module.exports = hereApi;