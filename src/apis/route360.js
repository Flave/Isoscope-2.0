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

function parseLatLonArray(latlngs) {

    var coordinates = new Array();

    for ( var i = 0 ; i < latlngs.length ; i++ )
        coordinates.push(new L.Point(latlngs[i][0], latlngs[i][1]))

    return coordinates;
};

function webMercatorToLeaflet(point){
  var leafletPoint = new L.Point(point[0], point[1]);
  leafletPoint.x /= 6378137;
  leafletPoint.y /= 6378137;
  L.CRS.EPSG3857.transformation._transform(leafletPoint);
  return [leafletPoint.x, leafletPoint.y];
};

function parsePolygons(polygonsJson) {
           
    if ( polygonsJson.error ) return errorMessage;

    var polygonList = [];

    _.each(polygonsJson, function(source){

        var sourcePolygons = { id : source.id , polygons : [] };

        _.each(source.polygons, function (polygonJson) {
            //console.log(polygonJson.outerBoundary);
            var point = webMercatorToLeaflet(polygonJson.outerBoundary[0]);
            console.log(point);

/*            var polygon = r360.polygon(polygonJson.travelTime, polygonJson.area, r360.Util.parseLatLonArray(polygonJson.outerBoundary));

            var color = _.findWhere(r360.config.defaultTravelTimeControlOptions.travelTimes, { time : polygon.getTravelTime() });
            polygon.setColor(!_.isUndefined(color) ? color.color : '#000000');
            
            var opacity = _.findWhere(r360.config.defaultTravelTimeControlOptions.travelTimes, { time : polygon.getTravelTime() })
            polygon.setOpacity(!_.isUndefined(opacity) ? opacity.opacity : 1);
            
            _.each(polygonJson.innerBoundary, function (innerBoundary) {
                polygon.addInnerBoundary(r360.Util.parseLatLonArray(innerBoundary));
            });

            sourcePolygons.polygons.push(polygon);*/
        });

        //polygonList.push(sourcePolygons);
    });

    return polygonList;
}

var route360Api = {


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
  get: function(options) {
    var deferred = Q.defer();

    var cfg = {
      "sources":[
        {
          "lat":52.51,
          "lng":13.37,
          "id":"le-id",
          "tm":{
            "transit":{
              "frame":{
                "time":45000,
                "date":"20150607"
              }
            }
          }
        }
      ],
      "polygon":{
        "values":[300, 1800]
      }
    };

    var params = util.JSON2QueryString({
      cfg: JSON.stringify(cfg),
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
        console.log(res);
        parsePolygons(res.data);
      }
    });

    return deferred.promise;
  }
}

module.exports = route360Api;    