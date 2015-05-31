var dispatcher = require('../dispatcher'),
    IsolineConstants = require('../constants/IsolineConstants');

var IsolineActions = {
  add: function(data) {
    dispatcher.handleAPIAction({
      actionType: IsolineConstants.ISOLINE_ADD,
      data: data
    });
  }
}

module.exports = IsolineActions;