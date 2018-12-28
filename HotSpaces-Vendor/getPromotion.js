let AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient();
let dynamoDBService = require('./dynamoDBService');

exports.handler = function (event, context, callback) {
    let vendorID = event.queryStringParameters.vendorId;
    console.log(vendorID);
    dynamoDBService.getPromo(vendorID).then(function (data) {
        callback(null, {
            "isBase64Encoded": true,
            "statusCode": 200,
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "*"
            },
            "body": JSON.stringify(data.Items)
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