var Q = require('q'),
    request = Q.denodeify(require('request'));


var api = {},
    jsonAttributes = 32,
    app_id = 'bVQHRXUn6uNHP3B24bdt',
    app_code = 'mwkokcyyoCIfExsmQq0qIg',
    base = 'http://route.st.nlp.nokia.com/routing/6.2/calculateisoline.json',
    params = '?mode=fastest%3Bcar&start=52.5160%2C13.3778&time=PT0H05M',
    authParams = `&app_id=${app_id}&app_code=${app_code}`,
    url = `${base}${params}${authParams}`;

/*
* @return Q (promise)
*/

api.get = function() {  
  var response = request(url);
  return response
    .then(function(res) {
      console.log(res[0].body);
      return res[0].body;
    });
}

module.exports = api;