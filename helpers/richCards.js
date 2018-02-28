'use strict';

const util = require('util');

/**
 * @name: getMessageTemplate
 * @description:
 * Common method for message template (text response)
 * 
 * @param  {string} message - text message
 * @return {[type]}         [description]
 */
exports.getMessageTemplate = function(message) {

    let messageContent = {
        "contentType": "PlainText", // SSML or PlainText
        "content": message
    };
    return messageContent;
};

/**
 * @name: getResponseCard
 * @description:
 * Common method for constructing rich cards
 * 
 * @param  {object} attachmentContent - attachment content
 * @return {[type]}                   [description]
 */
exports.getResponseCard = function(attachmentContent) {
    let responseCard = {
        "version": 2,
        "contentType": "application/vnd.amazonaws.card.generic",
        "genericAttachments": attachmentContent
    };
    return responseCard;
};

/**
 * @name: getAttachment
 * @description:
 * Common method for constructing rich cards
 * 
 * @param  {object} attachmentContent - attachment content
 * @return {[type]}                   [description]
 */
exports.getAttachment = function(title, subtitle, attachmentLinkUrl, imageUrl, buttonList) {
    let buttons = [];
    buttonList.forEach(val => {
        buttons.push({ text: val, value: val });
    });

    let responseCard = {
        "version": 2,
        "contentType": "application/vnd.amazonaws.card.generic",
        "genericAttachments": [{
            "title": title,
            "subTitle": subtitle,
            "buttons": buttons
        }]
    };

    if (!util.isNullOrUndefined(imageUrl)) {
        responseCard.imageUrl = imageUrl;
    }
    if (!util.isNullOrUndefined(attachmentLinkUrl)) {
        responseCard.attachmentLinkUrl = attachmentLinkUrl;
    }
    return responseCard;
};

/**
 * @name: getImageAttachment
 * @description:
 * Common method for constructing image attachment
 * 
 * @param  {object} attachmentContent - attachment content
 * @return {[type]}                   [description]
 */
exports.getImageAttachment = function(imageUrlList) {

    let responseCard = {
        "version": 2,
        "contentType": "application/vnd.amazonaws.card.generic",
        "genericAttachments": []
    };

    let attachmentList = [];
    imageUrlList.forEach(image => {
        let imageAttachment = {
            "title": image.title,
            "subTitle": "First Aid",
            imageUrl: image.imageUrl
        };
        attachmentList.push(imageAttachment);
    });

    responseCard.genericAttachments = attachmentList;

    return responseCard;
};
