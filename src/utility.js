var util = {};


/*
* @param {number} weekday - day of the week as number starting with 0
* @return {string} A date string with the format 2013-07-04T17:00:00+02
*/
util.getXsDateTime = function(weekday, hourOfTheDay, timeZoneOffset) {
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

/*
* Takes an object and returns a query string
*/
util.JSON2QueryString = function(obj) {
  var str = [];
  _.forEach(obj, function(value, key) {
    str.push(encodeURIComponent(key) + "=" + encodeURIComponent(value));
  });

  return str.join("&");
}

/*
* Takes query string and returns an object
*/
util.queryStringToJSON = function(queryString) {
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

module.exports = util;