let AWS = require('aws-sdk');
let dynamoDBService = require('./dynamoDBService');

exports.handler = function (event, context, callback) {
    let promoId = event.queryStringParameters.promoId;
    console.log(promoId);
    dynamoDBService.getNoOfRedeems(promoId).then(function (data) {
        console.log(data);
        let totalRedeems = 0;
        data.Items.map(item => totalRedeems += item.noOfRedeems)
        console.log(totalRedeems);
        callback(null, {
            "isBase64Encoded": true,
            "statusCode": 200,
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "*"
            },
            "body": totalRedeems
        });
        //your logic goes here
    }).catch(function (err) {
        console.log(err);
        callback(null, {
            "isBase64Encoded": true,
            "statusCode": 502,
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "*"
            },
            "body": err.message
        });
        //handle error
    });

}