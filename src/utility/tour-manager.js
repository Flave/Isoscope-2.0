var state = require('app/stores/StateStore'),
    _ = require('lodash');


var defaults = {
  tourDates: [],
  interval: 4000
}

function tourManager(options) {
  var that = {},
      currentStep = 0,
      intervalId;

  that.tourDates = options.tourDates || defaults.tourDates;
  that.interval = options.interval || defaults.interval;

  that.start = function() {
    intervalId = setInterval(processStep, that.interval);
    console.log('started tour');
  }

  that.stop = function() {
    clearInterval(intervalId);
    setTimeout(that.start, 8000);
    console.log('stopped tour');
  }

  that.pause = function() {

  }

  that.resume = function() {

  }

  function cleanupStep() {

  }

  function processStep() {
    console.log('tour step ' + currentStep);
    if(currentStep >= that.tourDates.length) 
      currentStep = 0;

    cleanupStep();
    state.set(that.tourDates[currentStep]);
    currentStep++;
  }

  return that;
}


module.exports = tourManager;