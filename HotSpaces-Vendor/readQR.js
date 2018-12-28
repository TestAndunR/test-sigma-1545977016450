let AWS = require('aws-sdk');
let dynamoDBService = require('./dynamoDBService');

exports.handler = function (event, context, callback) {

    console.log('data 23e23', event);
   dynamoDBService.getQR(event.queryStringParameters.qr).then(function (data) {
       console.log('promoData 2e3', data);
       let promo = {
        promo: data.Item.promoId,
        vendor: data.Item.vendorId
       };
       
        dynamoDBService.getPromoWithPromoId(promo).then(function (promoData) {

            console.log("data23221454", promoData);
            console.log('promoData', promoData !== null);
            if(promoData !== null){
                 console.log('promoData 46', promoData.Items);
            if(data.Item.type === promoData.Items[0].OfferType){
              
              let promo = {
                    data: promoData.Items[0],
                    user: data.Item.user,
                    name: 'cassie preston'
                };
          let response = {
            "statusCode": 200,
            "headers": {
                 "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "*"
            },
            "body": JSON.stringify(promo),
            "isBase64Encoded": false
        };
        callback(null, response);
            } else{
                 let response = {
            "statusCode": 403,
            "headers": {
                 "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "*"
            },
            "body": "Validation Failed",
            "isBase64Encoded": false
        };
                 callback(null, response);
            }
        
            } else{
                 let response = {
            "statusCode": 403,
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "*"
            },
            "body": "Validation Failed",
            "isBase64Encoded": false
        };
                 callback(null, response);
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
        })
    }).catch(function (err) {
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