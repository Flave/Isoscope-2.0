"use strict";

var React = require('react');
var Route = require('react-router').Route;
var NotFoundRoute = require('react-router').NotFoundRoute;
var DefaultRoute = require('react-router').DefaultRoute;
var Redirect = require('react-router').Redirect;
var App = require('./App');
var Home = require('./components/Home');
var About = require('./components/About');

var Routes = (
  <Route handler={App}>
    <Route name="home" path="/" handler={Home}/>
    <Route name="about" path="/about" handler={About}/>
  </Route>
);

module.exports = Routes;