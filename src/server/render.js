var Router = require('react-router');
var routes = require('../routes');
var React = require('react');
var HtmlDocument = require('./HtmlDocument');


var render = function(req, res, next) {

  // We customize the onAbort method in order to handle redirects
  var router = Router.create({
    routes: routes,
    location: req.path,
    onAbort: function defaultAbortHandler(abortReason, location) {
      if (abortReason && abortReason.to) {
        res.redirect(301, abortReason.to);
      } else {
        res.redirect(404, "404");
      }
    }
  });

  var markup = "";
  // Run the router, and render the result to string
  router.run(function (Handler, state) {
    markup = React.renderToString(React.createElement(Handler, {routerState: state}), null);
  });

  var html = React.renderToStaticMarkup(
    <HtmlDocument markup={markup}/>
  );

  // In production, we just serve the pre-compiled assets from the /build directory
  if (process.env.NODE_ENV === "production") {
  }

  res.send("<!DOCTYPE html>" + html);
}

module.exports = render;