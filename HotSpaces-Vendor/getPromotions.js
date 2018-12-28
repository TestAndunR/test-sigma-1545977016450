let AWS = require('aws-sdk');
let dynamoDBService = require('./dynamoDBService');
const ddb = new AWS.DynamoDB.DocumentClient();
let moment = require('moment');
let axios = require('axios');
let _ = require("lodash");
let authService = require('./authService');

exports.handler = function (event, context, callback) {
    console.log(event);
    let date = moment(Number(event.queryStringParameters.date)).format('YYYY-MM-DD');
    console.log(date);
    let userUUID = event.queryStringParameters.uuid;
    let userName = event.queryStringParameters.user;
    let latitude = Number(event.queryStringParameters.latitude);
    let longitude = Number(event.queryStringParameters.longitude);
    let radius = Number(event.queryStringParameters.radius);



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

            boxKeyObject = calculateBox(latitude, longitude);
            noOfBoxes = getNumberOfBoxes(radius);

            latMin = +boxKeyObject.lat - +noOfBoxes
            latMax = +boxKeyObject.lat + +noOfBoxes
            longMin = +boxKeyObject.long - +noOfBoxes
            longMax = +boxKeyObject.long + +noOfBoxes

            getPromotions(latMin, latMax, longMin, longMax, date)
                .then(data => {
                    console.log("%%%%", data);
                    let promoList = data;
                    callback(null, {
                        "isBase64Encoded": true,
                        "statusCode": 200,
                        "headers": {
                            "Access-Control-Allow-Origin": "*",
                            "Access-Control-Allow-Methods": "*"
                        },
                        "body": JSON.stringify(promoList)
                    });
                }).catch(
                    err => {
                        callback(null, {
                        "isBase64Encoded": true,
                        "statusCode": 200,
                        "headers": {
                            "Access-Control-Allow-Origin": "*",
                            "Access-Control-Allow-Methods": "*"
                        },
                        "body": err.message
                    });
                    }
                )

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

const getPromotions = (latMin, latMax, longMin, longMax, date) => 
    Promise.all(_.flatten(_.range(latMin, latMax)
            .map(lat => _.range(longMin, longMax)
                .map(long => `${lat},${long}`)))
        .map(boxKey => 
            dynamoDBService.retrievePromos(date, boxKey)
                .then(data => data.Items)
                .then(items => Promise.all(
                    
                    items.map(promo => 
                    dynamoDBService.getVendor(promo.vendorId)
                        .then(vendor => ({
                            ...promo,
                            imgs: promo.imgUrls,
                            vendorName: vendor.Items[0].name,
                        }))
                )))))
            .then(_.flatten);

function calculateBox(latitude, longitude){
    let latKey = Math.trunc((latitude + 90) * 10);
        let longKey = Math.trunc((longitude + 180) * 10);
        return {lat: latKey, long: longKey};
}

function getNumberOfBoxes(radiusInMeters){
        let numberOfBoxes = Math.ceil(radiusInMeters / 10000);
        return numberOfBoxes;
}

