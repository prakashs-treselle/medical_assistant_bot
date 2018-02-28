'use strict';

const util = require("util");

/**
 * @name: getResponseCard
 * @description:
 * Informs Amazon Lex that the user is expected to provide a slot value in the response.
 * 
 * @param  {Object} sessionAttributes [description]
 * @param  {string} intentName        [description]
 * @param  {Object} slots             [description]
 * @param  {Object} slotToElicit      [description]
 * @param  {Object} message           [description]
 * @return {[type]}                   [description]
 */
exports.elicitSlot = function(sessionAttributes, intentName, slots, slotToElicit, message, responseCard = null) {
  console.log("eloicit slot value");
  if (!util.isNullOrUndefined(responseCard)) {
    return {
      sessionAttributes,
      dialogAction: {
        type: 'ElicitSlot',
        intentName,
        slots,
        slotToElicit,
        message,
        responseCard
      },
    };
  }
  else {
    return {
      sessionAttributes,
      dialogAction: {
        type: 'ElicitSlot',
        intentName,
        slots,
        slotToElicit,
        message
      },
    };
  }

};

/**
 * @name: getResponseCard
 * @description:
 * Informs Amazon Lex that the user is expected to respond with an utterance that includes an intent
 * 
 * @param  {Object} sessionAttributes [description]
 * @param  {string} intentName        [description]
 * @param  {Object} message           [description]
 * @param  {[type]} responseCard      [description]
 * @return {[type]}                   [description]
 */
exports.elicitIntent = function(sessionAttributes, message, responseCard = null) {
  console.log("elicit intent");

  if (!util.isNullOrUndefined(responseCard)) {
    return {
      sessionAttributes,
      dialogAction: {
        type: 'ElicitIntent',
        message,
        responseCard
      }
    };
  }
  else {
    return {
      sessionAttributes,
      dialogAction: {
        type: 'ElicitIntent',
        message
      }
    };
  }
};

/**
 * @name: getResponseCard
 * @description:
 * Informs Amazon Lex not to expect a response from the user
 * 
 * @param  {Object} sessionAttributes [description]
 * @param  {Object} message           [description]
 * @param  {string} fulfillmentState  [description]
 * @param  {Object} message           [description]
 * @param  {Object} responseCard      [description]
 * @return {[type]}                   [description]
 */
exports.close = function(sessionAttributes, fulfillmentState, message, responseCard = null) {

  if (!util.isNullOrUndefined(responseCard)) {
    return {
      sessionAttributes,
      dialogAction: {
        type: 'Close',
        fulfillmentState,
        message,
        responseCard
      },
    };
  }
  else {
    return {
      sessionAttributes,
      dialogAction: {
        type: 'Close',
        fulfillmentState,
        message
      },
    };
  }

};

/**
 * [delegate description]
 * @param  {[type]} sessionAttributes [description]
 * @param  {[type]} slots            [description]
 * @return {[type]}                   [description]
 */
exports.delegate = function(sessionAttributes, slots) {
  console.log("delegate", sessionAttributes, slots);
  return {
    sessionAttributes,
    dialogAction: {
      type: 'Delegate',
      slots,
    },
  };
};

exports.confirmIntent = function(sessionAttributes, intentName, slots, message, responseCard = null) {
  if (!util.isNullOrUndefined(responseCard)) {
    return {
      sessionAttributes,
      dialogAction: {
        type: 'ConfirmIntent',
        intentName,
        slots,
        message,
        responseCard
      },
    };
  }
  else {
    return {
      sessionAttributes,
      dialogAction: {
        type: 'ElicitSlot',
        intentName,
        slots,
        message
      },
    };
  }

};
