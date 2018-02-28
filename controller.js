'use strict';

const richCards = require('./helpers/richCards');
const lexResponses = require('./helpers/lexResponses.js');
const utilities = require('./helpers/utilities.js');
const content = require('content/content.js');
const awsS3 = require('./helpers/S3.js');
const util = require('util');

module.exports = {

    /**
     * @name: MedicinalDrug
     * @description:
     * This function provides the details about the medicine and elicit the
     * intent for side effects for each medicine
     *
     * @param { Object } intentRequest - input event format from lex
     * @param  {Function} callback      [description]
     * @return {[type]}                 [description]
     */
    MedicinalDrug: (intentRequest, callback) => {
        // Getting the slot type
        let slots = intentRequest.currentIntent.slots;
        let medicineName = (slots.MedicineName).toLowerCase();

        awsS3.getObjectFromS3('medicine', 'json')
            .then(s3Object => {
                let medicineDetails = s3Object[medicineName];
                if (!util.isNullOrUndefined(medicineDetails)) {
                    let message = richCards.getMessageTemplate(medicineDetails.uses);
                    // TODO : 
                    let responseCard = richCards.getAttachment(medicineName.toUpperCase(), `Want to know about Side Effects of ${medicineName}`, null, null, [`Side Effects of ${medicineName}`]);
                    callback(lexResponses.elicitIntent(intentRequest.sessionAttributes, message, responseCard));
                }
                else {
                    let message = richCards.getMessageTemplate(`Sorry we don 't find any details about ${medicineName}. Please provide the valid name of the Drug or medicine.`);
                    callback(lexResponses.elicitSlot(intentRequest.sessionAttributes, intentRequest.currentIntent.name,
                        slots, 'MedicineName', message));
                }
            })
            .catch(err => {
                let message = richCards.getMessageTemplate(`Sorry we don 't find any details about ${medicineName}. Please provide the valid name of the Drug or medicine.`);
                callback(lexResponses.elicitSlot(intentRequest.sessionAttributes, intentRequest.currentIntent.name,
                    slots, 'MedicineName', message));

            });
    },

    /**
     * @name: BMIChecker
     * @description:
     * This function calculate the Body Mass Index (BMI) based on height and weight
     *
     * @param { Object } intentRequest - input event format from lex
     * @param  {Function} callback      [description]
     * @return {[type]}                 [description]
     */
    BMIChecker: (intentRequest, callback) => {
        // Getting the slot type
        let slots = intentRequest.currentIntent.slots;
        let weight = slots.Weight;
        let height = slots.Height;

        let BMI = utilities.getBMIValue(weight, height);
        let category = utilities.getBMICategory(BMI);

        let message = richCards.getMessageTemplate('We calculated your Body Mass Index. your BMI is `' + BMI + '` \n\n' + category);

        callback(lexResponses.elicitIntent(intentRequest.sessionAttributes, message));
    },

    /**
     * @name: SideEffects
     * @description:
     * This function Provides the side Effects based on drug or medicine
     *
     * @param { Object } intentRequest - input event format from lex
     * @param  {Function} callback      [description]
     * @return {[type]}                 [description]
     */
    SideEffects: (intentRequest, callback) => {
        // Getting the slot type
        let slots = intentRequest.currentIntent.slots;
        let medicineName = (slots.MedicineName).toLowerCase();

        awsS3.getObjectFromS3('medicine', 'json')
            .then(s3Object => {
                let medicineDetails = s3Object[medicineName];
                if (!util.isNullOrUndefined(medicineDetails)) {
                    let messageContent = `Some of the side Effects of using ${medicineName} are \n${medicineDetails.sideEffects}\n\nIf you found any of these, please stop using the medicine and contact your physician immediately!`;
                    let message = richCards.getMessageTemplate(messageContent);
                    callback(lexResponses.elicitIntent(intentRequest.sessionAttributes, message));
                }
                else {
                    let message = richCards.getMessageTemplate(`Sorry we don 't find any details about ${medicineName}. Please provide the valid name of the Drug or medicine.`);
                    callback(lexResponses.elicitSlot(intentRequest.sessionAttributes, intentRequest.currentIntent.name,
                        slots, 'MedicineName', message));
                }
            })
            .catch(err => {
                let message = "Sorry! we are unable to process your request at this time. Please try after some time!";
                callback(lexResponses.elicitIntent(intentRequest.sessionAttributes, richCards.getMessageTemplate(message)));

            });


    },

    /**
     * @name: SymptomsChecker
     * @description:
     * This function Provides the medicine and suggestion based on the symptoms
     * Later machine learning algorithm will be applied to predict the result
     *
     * @param { Object } intentRequest - input event format from lex
     * @param  {Function} callback      [description]
     * @return {[type]}                 [description]
     */
    SymptomsChecker: (intentRequest, callback) => {

        // Getting the slot type
        let slots = intentRequest.currentIntent.slots;
        let symptomsOne = slots.SymptomsOne;
        let symptomsTwo = slots.SymptomsTwo;


        if (intentRequest.invocationSource === 'DialogCodeHook') {

            if (util.isNullOrUndefined(symptomsOne)) {
                let message = richCards.getMessageTemplate("What symptoms you are facing?");
                callback(lexResponses.elicitSlot(intentRequest.sessionAttributes, intentRequest.currentIntent.name,
                    slots, 'SymptomsOne', message));
                return;
            }
            else if (util.isNullOrUndefined(symptomsTwo)) {
                let possibleSymptoms = utilities.getPossibleSymptoms(symptomsOne);

                callback(lexResponses.elicitSlot(intentRequest.sessionAttributes, intentRequest.currentIntent.name,
                    slots, 'SymptomsTwo', possibleSymptoms.message, possibleSymptoms.responseCard));
                return;
            }

            // Pass the price of the flowers back through session attributes to be used in various prompts defined on the bot model.
            const outputSessionAttributes = intentRequest.sessionAttributes || {};

            callback(lexResponses.delegate(outputSessionAttributes, intentRequest.currentIntent.slots));
            return;
        }

        awsS3.getObjectFromS3('treatment', 'json')
            .then(s3Object => {
                console.log("s3", s3Object);
                let treatment = s3Object[symptomsOne];
                let message = richCards.getMessageTemplate(`Since you are having ${symptomsOne} and ${symptomsTwo}. ${treatment.treatment}\n\n ${treatment.suggestions}`);
                callback(lexResponses.elicitIntent(intentRequest.sessionAttributes, message));
            })
            .catch(err => {
                let message = "Sorry! we are unable to process your request at this time. Please try after some time!";
                callback(lexResponses.elicitIntent(intentRequest.sessionAttributes, richCards.getMessageTemplate(message)));
            })
    },

    /**
     * @name: HealthTracker
     * @description:
     * This function Provides Basic details about the health that each people
     * should be aware of it.
     *
     * @param { Object } intentRequest - input event format from lex
     * @param  {Function} callback      [description]
     * @return {[type]}                 [description]
     */
    HealthTracker: (intentRequest, callback) => {
        // Getting the slot type
        let slots = intentRequest.currentIntent.slots;
        let healthDetailsCategory = slots.HealthDetails;

        awsS3.getObjectFromS3('healthDetails', 'json')
            .then(s3Object => {
                console.log("s3", s3Object);
                let healthDetailsMessage = s3Object[healthDetailsCategory];
                let message = richCards.getMessageTemplate(healthDetailsMessage);

                callback(lexResponses.elicitIntent(intentRequest.sessionAttributes, message));
            })
            .catch(err => {
                let message = "Sorry! we are unable to process your request at this time. Please try after some time!";
                callback(lexResponses.elicitIntent(intentRequest.sessionAttributes, richCards.getMessageTemplate(message)));
            })
    },

    /**
     * @name: Emergency
     * @description:
     * This function helps to provides details at the emergency situation
     *
     * @param { Object } intentRequest - input event format from lex
     * @param  {Function} callback      [description]
     * @return {[type]}                 [description]
     */
    Emergency: (intentRequest, callback) => {
        // Getting the slot type
        let slots = intentRequest.currentIntent.slots;
        let emergencyHelp = slots.EmergencyHelp;


        awsS3.getObjectFromS3('emergency', 'json')
            .then(s3Object => {
                console.log("s3", s3Object);
                let emergencyDetails = s3Object[emergencyHelp];
                if (emergencyHelp === 'medicalEmergency') {
                    let message = richCards.getMessageTemplate("In the case of Emergency Please do First Aid or Call Ambulance immediately");
                    let responseCard = richCards.getAttachment('Medical Emergency', `Please select any`, null, null, emergencyDetails);
                    callback(lexResponses.elicitIntent(intentRequest.sessionAttributes, message, responseCard));
                }
                else {
                    let message = richCards.getMessageTemplate(emergencyDetails);
                    callback(lexResponses.elicitIntent(intentRequest.sessionAttributes, message));
                }
            })
            .catch(err => {
                console.log(err);
                let message = "Sorry! we are unable to process your request at this time. Please try after some time!";
                callback(lexResponses.elicitIntent(intentRequest.sessionAttributes, richCards.getMessageTemplate(message)));
            })
    },

    /**
     * @name: MedicalEmergency
     * @description:
     * This function helps to provides details for medical emergency
     *
     * @param { Object } intentRequest - input event format from lex
     * @param  {Function} callback      [description]
     * @return {[type]}                 [description]
     */
    MedicalEmergency: (intentRequest, callback) => {
        // Getting the slot type
        let slots = intentRequest.currentIntent.slots;
        let medicalEmergency = slots.MedicalEmergencyDetails;


        awsS3.getObjectFromS3('emergency', 'json')
            .then(s3Object => {
                let medicalEmergencyDetails = s3Object[medicalEmergency];

                if (medicalEmergency === 'firstAidTips') {
                    let message = richCards.getMessageTemplate("In the case of Emergency Please do First Aid or Call Ambulance immediately");
                    let responseCard = richCards.getAttachment('First Aid Tips', `Please select any`, null, null, medicalEmergencyDetails);
                    callback(lexResponses.elicitIntent(intentRequest.sessionAttributes, message, responseCard));
                }
                else {
                    let message = richCards.getMessageTemplate(medicalEmergencyDetails);
                    let imageNames = medicalEmergency + 'Images';
                    let imagesList = s3Object[imageNames];
                    let responseCard = richCards.getImageAttachment(imagesList);
                    callback(lexResponses.elicitIntent(intentRequest.sessionAttributes, message, responseCard));
                }
            })
            .catch(err => {
                console.log(err);
                let message = "Sorry! we are unable to process your request at this time. Please try after some time!";
                callback(lexResponses.elicitIntent(intentRequest.sessionAttributes, richCards.getMessageTemplate(message)));
            })
    },

    /**
     * @name: FirstAidTips
     * @description:
     * This function helps to provides details for first aid
     *
     * @param { Object } intentRequest - input event format from lex
     * @param  {Function} callback      [description]
     * @return {[type]}                 [description]
     */
    FirstAidTips: (intentRequest, callback) => {
        // Getting the slot type
        let slots = intentRequest.currentIntent.slots;
        let firstAidCategory = slots.FirstAidDetails;


        awsS3.getObjectFromS3('firstAid', 'json')
            .then(s3Object => {
                console.log("s3", s3Object);
                let firstAidDetails = s3Object[firstAidCategory];
                let message = richCards.getMessageTemplate(firstAidDetails);
                let imageNames = firstAidCategory + 'Images';
                let imagesList = s3Object[imageNames];
                let responseCard = richCards.getImageAttachment(imagesList);

                callback(lexResponses.elicitIntent(intentRequest.sessionAttributes, message, responseCard));
            })
            .catch(err => {
                let message = "Sorry! we are unable to process your request at this time. Please try after some time!";
                callback(lexResponses.elicitIntent(intentRequest.sessionAttributes, richCards.getMessageTemplate(message)));
            })
    }
};
