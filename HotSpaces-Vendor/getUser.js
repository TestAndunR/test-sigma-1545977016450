let AWS = require('aws-sdk');
let dynamoDBService = require('./dynamoDBService');
let utils = require('./utils');

exports.handler = function(event, context, callback) {
    let userId = event["queryStringParameters"]['userid'];

    if (utils.authorize(event, callback) && userId) {
       
        dynamoDBService.getUser(userId).then(data => {
            let items = data.Items;

            if (items.length > 0) {
                callback(null, {
                    "isBase64Encoded": true,
                    "statusCode": 200,
                    "headers": {
                        "Access-Control-Allow-Origin": "*",
                        "Access-Control-Allow-Methods": "*"
                    },
                    "body": JSON.stringify(items[0])
                });
            } else {
                callback(null, {
                    "isBase64Encoded": true,
                    "statusCode": 502,
                    "headers": {
                        "Access-Control-Allow-Origin": "*",
                        "Access-Control-Allow-Methods": "*"
                    },
                    "body": 'No user with the provided user id'
                });
            }

        }).catch(error => {
            console.log(error);
            callback(null, {
                "isBase64Encoded": true,
                "statusCode": 502,
                "headers": {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "*"
                },
                "body": 'Faild to retreive the user for id : ' + userId
            });
        })
    } else {
        callback(null, {
            "isBase64Encoded": true,
            "statusCode": 502,
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "*"
            },
            "body": 'User id is missing in query params.'
        });
    }
}