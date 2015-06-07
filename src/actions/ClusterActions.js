var dispatcher = require('../dispatcher'),
    ClusterConstants = require('../constants/ClusterConstants');

var ClusterActions = {
  add: function(data) {
    dispatcher.handleAPIAction({
      actionType: ClusterConstants.CLUSTER_ADD,
      data: data
    });
  }
}

module.exports = ClusterActions;