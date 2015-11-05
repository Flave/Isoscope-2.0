var state = require('app/stores/StateStore'),
    _ = require('lodash');


var defaults = {
  tourDates: [],
  interval: 10000
}

function tourManager(options) {
  var that = {},
      currentStep = 0,
      isRunning = false,
      intervalId;

  that.tourDates = options.tourDates || defaults.tourDates;
  that.interval = options.interval || defaults.interval;

  that.start = function() {
    if(!isRunning) {
      intervalId = setInterval(processStep, that.interval);
      console.log('started tour');
      isRunning = true;
    }
    return that;
  }

  that.stop = function() {
    if(isRunning) {
      clearInterval(intervalId);
      console.log('stopped tour');
      isRunning = false;
    }
    return that;
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