var IsolineConstants = require('../constants/IsolineConstants'),
    EventEmitter = require('events').EventEmitter,
    dispatcher = require('../dispatcher'),
    _ = require('lodash');

var CHANGE_EVENT = 'change';

var _isolines = [];

function add(data) {
  _isolines.push(data);

}

var IsolineStore = _.assign({}, EventEmitter.prototype, {
  getAll: function() {
    return _isolines;
  },

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  dispatcherIndex: dispatcher.register(function(payload) {
    var action = payload.action;

    switch(action.actionType) {
      case IsolineConstants.ISOLINE_ADD:
        add(action.data);
        IsolineStore.emitChange();
        break;
      default:
        break;
    }

    return true;
  })
});

module.exports = IsolineStore;