let AWS = require('aws-sdk');
let dynamoDBService = require('./dynamoDBService');
let utils = require('./utils');

exports.handler = function(event, context, callback) {
    
    if (utils.authorize(event, callback)) {
        dynamoDBService.getVendors().then(function (data) {
            callback(null, {
                "isBase64Encoded": true,
                "statusCode": 200,
                "headers": {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "*"
                },
                "body": JSON.stringify(data.Items)
            });
        }).catch(err => {
            callback(null, {
                "isBase64Encoded": true,
                "statusCode": 502,
                "headers": {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "*"
                },
                "body": err.message
            })
        });
    }
}