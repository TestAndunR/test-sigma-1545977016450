let AWS = require('aws-sdk');
const cognito_idp = new AWS.CognitoIdentityServiceProvider();
let dynamoDBService = require('./dynamoDBService');
let utils = require('./utils');

exports.handler = function (event, context, callback) {

    if (utils.authorize(event, callback)) {

        let body = JSON.parse(event.body);
        let name = body.name;
        let email = body.email;
        let phone_number = body.phone_number;
        let temp_password = body.temp_password;
        let role = body.role;
        let vendorId = body.vendor_id;
        

        cognito_idp.adminCreateUser({
            UserPoolId: "us-east-1_mcdTV1jKi",
            Username: `${email}`,
            DesiredDeliveryMediums: ["EMAIL", "SMS"],
            ForceAliasCreation: false,
            TemporaryPassword: `${temp_password}`,
            UserAttributes: [{
                Name: "name",
                Value: `${name}`
            }, {
                Name: "email",
                Value: `${email}`
            }, {
                Name: "phone_number",
                Value: `${phone_number}`
            }, {
                Name: "custom:email_verified",
                Value: "true"
            }, {
                Name: "custom:phone_number_verified",
                Value: "true"
            }],
            ValidationData: []
        }, function (error, data) {
            if (error) {
                console.log(error);
                callback(null, {
                    "isBase64Encoded": true,
                    "statusCode": 502,
                    "headers": {
                        "Access-Control-Allow-Origin": "*",
                        "Access-Control-Allow-Methods": "*"
                    },
                    "body": error.message
                });
            } else {
                console.log(data);
                dynamoDBService.addUser({
                    uid: data.User.Username,
                    name: name,
                    role: role,
                    vendor_id: vendorId
                }).then(function () {
                    callback(null, {
                        "isBase64Encoded": true,
                        "statusCode": 200,
                        "headers": {
                            "Access-Control-Allow-Origin": "*",
                            "Access-Control-Allow-Methods": "*"
                        },
                        "body": 'Successfully added vendor with name : ' + name
                    });
                }).catch(function (error) {
                    console.log(error);
                    callback(null, {
                        "isBase64Encoded": true,
                        "statusCode": 502,
                        "headers": {
                            "Access-Control-Allow-Origin": "*",
                            "Access-Control-Allow-Methods": "*"
                        },
                        "body": 'User added to cognito pool but failed to add to dynamo DB. ' + error.message
                    });
                });

            }
        });
    }
}