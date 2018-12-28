let AWS = require('aws-sdk');
let dynamoDBService = require('./dynamoDBService');

exports.handler = function(event, context, callback) {
    // console.log(event);
    body = JSON.parse(event.body);
    console.log(body)
    let updatedData = {
        promoId: body.promoId,
        vendorId: body.vendorId,
        offerType: body.offerType,
        discount: body.discount,
        startDate: body.startDate,
        endDate: body.endDate,
        startTime: body.startTime,
        endTime: body.endTime,
        selectedDays: body.selectedDays,
        description: body.description,
        title: body.title,
        unitPrice: body.unitPrice,
        // imgUrl: body.imgUrls,
        terms: body.terms,
        businessType: body.businessType,
        timestamp: body.timestamp,
        locationBox: body.locationBox,
        latNLong: body.latNLong
    }

    // console.log(updatedData);
    
    dynamoDBService.updatePromo(updatedData)
        .then(function (data) {
        console.log("Success", data);
            callback(null, {
                "isBase64Encoded": true,
                "statusCode": 200,
                "headers": {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "*"
                },
                "body": JSON.stringify(updatedData)
            });
        }).catch(function (err) {
            console.log("Error", err);
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