'use strict';

const AWS = require("aws-sdk");

/**
 * @name: getObjectFromS3
 * @description :
 * Get the s3 object based on file or specific versionId from the s3 bucket
 * which matches certain key
 * 
 * @param  {string} environment - environment
 * @param  {string} configType  - configType
 * @param  {string} fileName    - fileName
 * @param  {string} fileType    - fileType
 * @param  {string} versionId   - versionId 
 */
exports.getObjectFromS3 = function(fileName, fileType) {
 return new Promise((resolve, reject) => {

  var AWS_S3 = new AWS.S3({
   apiVersion: '2010-12-01'
  });

  var params = {
   Bucket: 'chat-bot-bucket', // Getting bucket name from the config
   Key: `MedicalAssistant/${fileName}.${fileType}`
  };

  AWS_S3.getObject(params, function(err, data) {
   if (err) reject(err); // an error occurred
   else resolve(JSON.parse(data.Body.toString()));
  });
 });
};
