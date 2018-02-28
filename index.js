'use strict';

const intentFunctions = require('./controller');
const AWS = require('aws-sdk');
const richCards = require('./helpers/richCards');
const lexResponses = require('./helpers/lexResponses');

/**
 * @name: dispatchIntentRequest
 * @description:
 * Dispatch the Intent request with callback function as optional params
 * Execute the function based on the intent name to fullfill user request
 * 
 * @param  {object}   intentRequest - Input request object from lex
 * @param  {Function} callback      - callback function
 * @return {[type]}                 [description]
 */
function dispatchIntentRequest(intentRequest, callback) {
    try {
        console.log(`request received for userId=${intentRequest.userId}, intentName=${intentRequest.currentIntent.name}`);
        console.info("Intentrequest: ", intentRequest);

        const sessionAttributes = intentRequest.sessionAttributes || {};
        sessionAttributes.userId = intentRequest.userId;

        const intentName = intentRequest.currentIntent.name;
        return intentFunctions[intentName](intentRequest, callback);
    }
    catch (err) {
        let message = "Sorry! we are unable to process your request at this time. Please try after some time!";
        return callback(lexResponses.elicitIntent(intentRequest.sessionAttributes, richCards.getMessageTemplate(message)));
    }
}

/**
 * @name: handler
 * @description:
 * Main handler function
 * 
 * @param  {Object}   event    - Input event object from lex
 * @param  {[type]}   context  [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
exports.handler = (event, context, callback) => {

    console.info("Initializing Medical Assistant Handler");

    let isBotEnabled = process.env.IS_BOT_ENABLED;
    let secretKey = process.env.SECRET_KEY;

    if (process.env.IS_BOT_ENABLED && process.env.SECRET_KEY) {
        // Dispatch to your skill's intent handlers
        dispatchIntentRequest(event, (response) => {
            console.log(`request completed for userId=${event.userId}, intentName=${event.currentIntent.name}`);
            callback(null, response);
        });
    }
    else {
        console.log("invalid bot code");
        let message = "Sorry! we are unable to process your request at this time. Please try after some time!";
        callback(null, lexResponses.elicitIntent(event.sessionAttributes, richCards.getMessageTemplate(message)));
    }
};
