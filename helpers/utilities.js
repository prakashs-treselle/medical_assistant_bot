'use strict';

const richCards = require('./richCards');
const content = require('../content/content.js');
const crypto = require('crypto');

/**
 * @name: getPossibleSymptoms
 * @description:
 * This function checks the possible symptoms for the patient based on
 * the provided symptoms
 * 
 * @param  {string} message - text message
 * @return {[type]}         [description]
 */
exports.getPossibleSymptoms = function(symptoms) {
    let possibleSymptoms = content.possibleSymptoms[symptoms];

    let message = richCards.getMessageTemplate(`We have recorded your symptoms as ${symptoms}. Along with this do you feel having any other symptoms? please select`);

    let responseCard = richCards.getAttachment('Possible Symptoms', `Do you have the following symptoms along with ${symptoms}?`, null, null, possibleSymptoms);
    return {
        message: message,
        responseCard: responseCard
    };
};

/**
 * @name: getBMIValue
 * @description:
 * This function calculates BMI based on the height and weight
 * 
 * @param  {string} message - text message
 * @return {[type]}         [description]
 */
exports.getBMIValue = function(weight, height) {

    height = height / 100;
    let BMI = weight / (height * height);
    return Math.round(BMI);
};

/**
 * @name: getBMICategory
 * @description:
 * This function provides the category based on BMI value
 * 
 * @param  {string} message - text message
 * @return {[type]}         [description]
 */
exports.getBMICategory = function(BMI) {

    let category = 'Your Body Mass Index Says that you are considered as ';
    if (BMI < 18.5) {
        category += '`Underweight person`';
    }
    else if (BMI >= 18.5 && BMI <= 24.9) {
        category += '`Normal and healthy person`';
    }
    else if (BMI >= 25 && BMI <= 29.9) {
        category += '`Overweight person`';
    }
    else {
        category += '`Obesity`';
    }
    return category;
};