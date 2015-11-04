var dispatcher = require('../dispatcher'),
    ClusterConstants = require('../constants/ClusterConstants');

var ClusterActions = {
  update: function(data) {
    dispatcher.handleAPIAction({
      actionType: ClusterConstants.CLUSTER_UPDATE,
      data: data
    });
  },
  remove: function(data) {
    dispatcher.handleAPIAction({
      actionType: ClusterConstants.CLUSTER_REMOVE,
      data: data
    });
  }
}

module.exports = ClusterActions;