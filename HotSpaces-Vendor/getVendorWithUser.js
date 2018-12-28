let AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient();
let dynamoDBService = require('./dynamoDBService');


exports.handler = function (event, context, callback) {
    console.log("aaaaa", event);
    let userData = {};
    let userId = event.queryStringParameters.userId;
    dynamoDBService.getUser(userId)
        .then(function (data) {
            userData["userRole"] = data.Items[0].role;
            console.log(data.Items[0].vendor_id);
            let vendorId = data.Items[0].vendor_id;
            ddb.get({
                TableName: 'HS_Vendor',
                Key: {
                    'vendor_id': vendorId
                }
            }).promise()
                .then(function (data) {
                    console.log("vendor", data);
                    userData["vendorName"] = data.Item.name;
                    callback(null, {
                        "isBase64Encoded": true,
                        "statusCode": 200,
                        "headers": {
                            "Access-Control-Allow-Origin": "*",
                            "Access-Control-Allow-Methods": "*"
                        },
                        "body": JSON.stringify(userData)
                    })
                    // userData[""]
                    //your logic goes here
                }).catch(function (err) {
                    //handle error
                    console.log(err);
                });
        })
        .catch(function (err) {
            //handle error
            console.log(err);
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