var hereApi = require('./apis/here');


function initializeRoutes(server) {
  server.get('/api/*', function(req, res) {
    hereApi.get(req.params)
      .then(function(data){
        res.send({data: data});
      }, function(err) {
        console.log(err);
        res.send('There was an error duude');
      });
  });
}

module.exports = initializeRoutes;