let AWS = require('aws-sdk');
let dynamoDBService = require('./dynamoDBService');
const uuidv4 = require('uuid/v4');


exports.handler = function(event, context, callback) {
    
    console.log('data er4r', event.queryStringParameters);
    let data={
        promo:event.queryStringParameters.promo,
        userId:event.queryStringParameters.user
    }
   dynamoDBService.scanRedeem(data).then(function (data) {
       console.log('dara 23', data);
        console.log('data', data.Items.length == 0);
        if (data.Items.length == 0) {
             let redeem ={
                 redeemId:uuidv4(),
                 promoId:event.queryStringParameters.promo,
                 userId:event.queryStringParameters.user,
                 noOfRedeems:1
             }
            dynamoDBService.putRedeem(redeem).then(function (data) {
                 console.log('data werwqr', data);
                let response = {
                    "statusCode": 200,
                    "headers": {
                        "Access-Control-Allow-Origin": "*",
                        "Access-Control-Allow-Methods": "*"
                    },
                    "body": "Successfull",
                    "isBase64Encoded": false
                };
                callback(null, response);
            }).catch(function (err) {
                  let response = {
                    "statusCode": 502,
                    "headers": {
                       "Access-Control-Allow-Origin": "*",
                       "Access-Control-Allow-Methods": "*"
                    },
                    "body": err,
                    "isBase64Encoded": false
                };
                 callback(null, response);
            });
        } else {
            console.log('data 343142', data.Items[0]);
        
            let redeemData = {
                val: parseInt(data.Items[0].noOfRedeems) + 1,
                redeemId:data.Items[0].redeemId
            }
            dynamoDBService.updateRedeem(redeemData).then(function (data) {
                 let response = {
                    "statusCode": 200,
                    "headers": {
                        "Access-Control-Allow-Origin": "*",
                        "Access-Control-Allow-Methods": "*"
                    },
                    "body": "Successfull",
                    "isBase64Encoded": false
                };
                 callback(null, response);
            }).catch(function (err) {
               let response = {
                    "statusCode": 502,
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
    }).catch(function (err) {
        let response = {
                    "statusCode": 502,
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