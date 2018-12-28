let AWS = require('aws-sdk');
let dynamoDBService = require('./dynamoDBService');
const uuidv4 = require('uuid/v4');
const NodeGeocoder = require('node-geocoder');

exports.handler = function (event, context, callback) {

    let body = JSON.parse(event.body);
    let timestamp = Math.round((new Date()).getTime() / 1000);

    const options = {
        provider: 'google',

        httpAdapter: 'https',
        apiKey: process.env.mapsApiKey,
        formatter: null
    };

    let geocoder = NodeGeocoder(options);
    console.log("GeoLocator");
    geocoder.reverse({ lat: body.latNLong.lat, lon: body.latNLong.long })
        .then(res => {
            console.log(res);
            let address = res[0].formattedAddress
            let promoData = {
                promoId: uuidv4(),
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
                imgUrl: body.imgUrls,
                terms: body.terms,
                businessType: body.businessType,
                timestamp: timestamp,
                locationBox: body.locationBox,
                latNLong: body.latNLong,
                address: address
            };
            console.log("PromoData$$$", promoData)
            dynamoDBService.addPromo(promoData)
                .then(function (data) {
                    console.log("Success", data);
                    callback(null, {
                        "isBase64Encoded": true,
                        "statusCode": 200,
                        "headers": {
                            "Access-Control-Allow-Origin": "*",
                            "Access-Control-Allow-Methods": "*"
                        },
                        "body": JSON.stringify(promoData)
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

        }).catch(err => {
            console.log("error", err.message);
        })

}