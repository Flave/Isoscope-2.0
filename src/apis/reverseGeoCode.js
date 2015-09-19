var jsonp = require('jsonp'),
    _ = require('lodash'),
    Q = require('q'),
    util = require('app/utility').apiUtility;

var app_id = 'bVQHRXUn6uNHP3B24bdt',
    app_code = 'mwkokcyyoCIfExsmQq0qIg',
    base = 'http://reverse.geocoder.cit.api.here.com/6.2/reversegeocode.json';


function processResponse(res, latlng) {
  var addressData = res.Response.View[0].Result[0].Location.Address,
      city = addressData.City,
      address = addressData.Street || addressData.District || addressData.PostalCode;

  if(addressData.Street && addressData.HouseNumber)
    address += " " + addressData.HouseNumber;

  return {
    city: city,
    address: address,
    latlng: latlng
  }
}


var reverseGeoCodeApi = {
  get: function(latlng) {
    var deferred = Q.defer();

    var params = util.JSON2QueryString({
      prox: `${latlng.toString()},100`,
      gen: 9,
      mode: 'retrieveAddresses',
      app_id: app_id,
      app_code: app_code
    });


    jsonp(`${base}?${params}`, {param: 'jsonCallback'}, function(err, res) {
      if(err)
        deferred.reject(error);
      else {
        
        deferred.resolve(processResponse(res, latlng));
      }
    });

    return deferred.promise;
  }
}

module.exports = reverseGeoCodeApi;