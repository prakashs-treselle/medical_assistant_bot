'use strict';

const AWS = require('aws-sdk');

/**
 * @name: buildValidationResult
 * @description:
 * Build validation result for Intent slot filling
 * using Lambda initialization and validation
 * 
 * @param  {Boolean} isValid        - slot validation status
 * @param  {[type]}  violatedSlot   - violated slot types
 * @param  {[type]}  messageContent - message content
 * @return {[type]}                 [description]
 */
exports.buildValidationResult = function(isValid, violatedSlot, messageContent) {
 if (messageContent == null) {
  return {
   isValid,
   violatedSlot,
  };
 }
 return {
  isValid,
  violatedSlot,
  message: { contentType: 'PlainText', content: messageContent },
 };
}

/**
 * @name: checkJobOpenings
 * @description:
 * Validate the user slot for Job intent, to check job openings for positions
 * 
 * @param  {string} jobPositions - job position
 * @return {[type]}              [description]
 */
exports.checkJobOpenings = function(jobPositions) {
 const jobPositionssList = ['frontEndJobDetails', 'systemAdminJobDetails', 'webDeveloperJobDetails', 'javaDeveloperDetails', 'pythonDeveloperJobDetails'];

 var isJobAvailable = false;
 if (jobPositions) {
  isJobAvailable = jobPositionssList.some(route => jobPositions.match(route));
 }

 if (!isJobAvailable) {
  return this.buildValidationResult(false, 'jobPositions', `Sorry! We do not have any openings right now. We wil reach you out when we find vacancies. \n \n please use the below link to submit your resume http://www.treselle.com/careers/submit-your-resume/`);
 }

 return this.buildValidationResult(true, null, null);
};
