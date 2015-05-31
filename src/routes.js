"use strict";

var React = require('react');
var Route = require('react-router').Route;
var NotFoundRoute = require('react-router').NotFoundRoute;
var DefaultRoute = require('react-router').DefaultRoute;
var Redirect = require('react-router').Redirect;
var App = require('./App.react');
var Master = require('./components/Master.react');
var Info = require('./components/Info.react');

var Routes = (
  <Route handler={App}>
    <Route name="home" path="/" handler={Master}/>
    <Route name="info" path="/info" handler={Info}/>
  </Route>
);

module.exports = Routes;