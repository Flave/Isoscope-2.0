var Dispatcher = require('flux').Dispatcher,
    _ = require('lodash');

var AppDispatcher = _.assign(new Dispatcher(), {

  /**
   * A bridge function between the views and the dispatcher, marking the action
   * as a view action.  Another variant here could be handleServerAction.
   * @param  {object} action The data coming from the view.
   */
   
  handleViewAction: function(action) {
    console.log('Dispatching view action: ', action);
    this.dispatch({
      source: 'VIEW_ACTION',
      action: action
    });
  },

  handleAPIAction: function(action) {
    console.log('Dispatching api action: ', action);
    this.dispatch({
      source: 'API_ACTION',
      action: action
    })
  }

});

module.exports = AppDispatcher;