"use strict";

var React = require('react');
var Route = require('react-router').Route;
var NotFoundRoute = require('react-router').NotFoundRoute;
var DefaultRoute = require('react-router').DefaultRoute;
var Redirect = require('react-router').Redirect;
var App = require('./App');
var Master = require('./components/Master');
var Info = require('./components/Info');

var Routes = (
  <Route handler={App}>
    <Route name="home" path="/" handler={Master}/>
    <Route name="info" path="/info" handler={Info}/>
  </Route>
);

module.exports = Routes;