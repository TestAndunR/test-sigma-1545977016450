let AWS = require('aws-sdk');
let dynamoDBService = require('./dynamoDBService');
let utils = require('./utils');

exports.handler = function(event, context, callback) {
    if (utils.authorize(event, callback)) {
        
        let body = JSON.parse(event.body);
        let vendorName = body.name;
        let vendor = {
            name: vendorName
        }
        dynamoDBService.addVendor(vendor).then(function (data) {
            callback(null, {
                "isBase64Encoded": true,
                "statusCode": 200,
                "headers": {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "*"
                },
                "body": 'Successfully added vendor with name : ' + vendorName
            });
        }).catch(function (err) {
            callback(null, {
                "isBase64Encoded": true,
                "statusCode": 502,
                "headers": {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "*"
                },
                "body": err.message
            });
        });
    }
}