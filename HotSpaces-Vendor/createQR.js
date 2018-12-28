let AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient();
let dynamoDBService = require('./dynamoDBService');
let authService = require('./authService');
const uuidv4 = require('uuid/v4');

exports.handler = function (event, context, callback) {

    console.log("event", event.queryStringParameters);
    let promo = {
        promo: event.queryStringParameters.promo,
        vendor: event.queryStringParameters.vendor
    };

    let userUUID = event.queryStringParameters.uuid;
    let userName = event.queryStringParameters.user;
    
     authService.validateUser(userUUID, userName, function (response) {
        if (response.error) {
            callback(null, {
                "isBase64Encoded": true,
                "statusCode": 502,
                "headers": {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "*"
                },
                "body": JSON.stringify(response.error)
            });
        } else if (response.validated) {
           createQR(event.queryStringParameters,promo, callback);
        } else {
            callback(null, {
                "isBase64Encoded": true,
                "statusCode": 403,
                "headers": {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "*"
                },
                "body": "User validation failed."
            });
        }
    });

}
    function createQR(event, promo, callback) {
        dynamoDBService.getPromoWithPromoId(promo).then(function (data) {
        console.log('data 324', data.Items[0]);
    console.log('data 3245', data.Items[0].offerType);
    
        let qr = {
            "promo": event.promo,
            "vendor": event.vendor,
            "type": parseInt(data.Items[0].category),
            "offerType": parseInt(data.Items[0].offerType),
            "user": event.user,
            "userName":event.userName,
            "grabTime": event.grab
        };
        console.log('qr', qr);
        var uuid = uuidv4();
        console.log('uuid', uuid);
        var uuid = parseInt(data.Items[0].offerType) + uuid;
        console.log('loggg', uuid);
        dynamoDBService.addToQR(qr, uuid).then(function (data) {
            let response = {
                "statusCode": 200,
                "headers": {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "*"
                },
                "body": JSON.stringify(uuid),
                "isBase64Encoded": false
            };
            callback(null, response);
        }).catch(function (err) {
            console.log('eerrr', err);
            let response = {
                "statusCode": 403,
                "headers": {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "*"
                },
                "body": err,
                "isBase64Encoded": false
            };
            callback(null, response);
        });


    }).catch(function (err) {
         console.log('eerrr12', err);
        let response = {
            "statusCode": 403,
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "*"
            },
            "body": err,
            "isBase64Encoded": false
        };
        callback(null, response);
    });
    }