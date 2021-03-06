"use strict";

var React = require('react'),
    Route = require('react-router').Route,
    NotFoundRoute = require('react-router').NotFoundRoute,
    DefaultRoute = require('react-router').DefaultRoute,
    Redirect = require('react-router').Redirect,
    App = require('./App.react'),
    Master = require('./components/Master.react'),
    Info = require('./components/Info.react'),
    TransitionTest = require('./components/TransitionTest.react');

var Routes = (
  <Route handler={App}>
    <Route name="home2" path="/" handler={Master}/>
    <Route name="home" path="/isoscope/?" handler={Master}/>
    <Route name="info" path="/info" handler={Info}/>
    <Route name="transition-test" path="/transition-test" handler={TransitionTest} />
  </Route>
);

module.exports = Routes;