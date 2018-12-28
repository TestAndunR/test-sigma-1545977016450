let AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient();
const uuidv4 = require('uuid/v4');

module.exports = {

    getUser: function (userId) {
        return ddb.query({
            TableName: 'HS_User',
            ExpressionAttributeValues: {
                ':user_id': userId
            },
            KeyConditionExpression: 'user_id = :user_id'
        }).promise()

    },

    /*
     userData={
         name : string,
         role : string,
         vender_id : string
     }
     */
    addUser: function (userData) {
        let userId = userData.uid;
        let name = userData.name;
        let role = userData.role;
        let vendor_id = userData.vendor_id;
        return ddb.put({
            TableName: 'HS_User',
            Item: {
                'user_id': userId,
                'name': name,
                'role': role,
                'vendor_id': vendor_id
            }
        }).promise();
    },

    /*
     userData={
         name : string
     }
     */
    addVendor: function (vendorData) {
        let vendorId = uuidv4();
        let name = vendorData.name;
        return ddb.put({
            TableName: 'HS_Vendor',
            Item: {
                'vendor_id': vendorId,
                'name': name
            }
        }).promise();
    },

    getVendors: function () {
        return ddb.scan({
            TableName: 'HS_Vendor'
        }).promise();
    },

    getVendor: function (vendorId) {
        return ddb.query({
            TableName: 'HS_Vendor',
            ExpressionAttributeValues: {
                ':vendor_id': vendorId
            },
            KeyConditionExpression: 'vendor_id = :vendor_id'
        }).promise()
    },

    addPromo: function (promoData) {
        console.log('promoData', promoData);
        return ddb.put({
            TableName: 'HS_Promotions',
            Item: {
                'promoId': promoData.promoId,
                'vendorId': promoData.vendorId,
                'termsNConditions': promoData.terms,
                'offerType': promoData.offerType,
                'startDate': promoData.startDate,
                'endDate': promoData.endDate,
                'startTime': promoData.startTime,
                'endTime': promoData.endTime,
                'selectedDays': promoData.selectedDays,
                'description': promoData.description,
                'unitPrice': promoData.unitPrice,
                'title': promoData.title,
                'imgUrls': promoData.imgUrl,
                'discount': promoData.discount,
                'category': promoData.businessType,
                'timestamp': promoData.timestamp,
                'locationBox': promoData.locationBox,
                'latNLong': promoData.latNLong,
                'address': promoData.address
            }
        }).promise()
    },

    deletePromo: function (promoData) {
        return ddb.delete({
            TableName: 'HS_Promotions',
            Key: {
                'promoId': promoData.promoID,
                'timestamp': promoData.timestamp
            }
        }).promise()
    },

    retrievePromos: function (date, box) {
        return ddb.scan({
            TableName: 'HS_Promotions',
            ExpressionAttributeValues: {
                ':date': date,
                ':box': box
            },
            FilterExpression: 'startDate <= :date and endDate >= :date and locationBox = :box'
        }).promise()
    },

    getPromo: function (vendor) {
        return ddb.scan({
            TableName: 'HS_Promotions',
            ExpressionAttributeValues: {
                ':vendor': vendor
            },
            FilterExpression: 'vendorId = :vendor'
        }).promise();
    },

    updatePromo: function (updatedData) {
        console.log(updatedData);
        return ddb.update({
            TableName: 'HS_Promotions',
            Key: {
                'promoId': updatedData.promoId,
                'timestamp': updatedData.timestamp
            },
            ExpressionAttributeNames: {
                '#category': 'category',
                '#description': 'description',
                '#discount': 'discount',
                '#endDate': 'endDate',
                '#endTime': 'endTime',
                '#latNLong': 'latNLong',
                '#locationBox': 'locationBox',
                '#offerType': 'offerType',
                '#selectedDays': 'selectedDays',
                '#startDate': 'startDate',
                '#startTime': 'startTime',
                '#title': 'title'
            },
            ExpressionAttributeValues: {
                ':category': updatedData.businessType,
                ':description': updatedData.description,
                ':discount': updatedData.discount,
                ':endDate': updatedData.endDate,
                ':endTime': updatedData.endTime,
                ':latNLong': updatedData.latNLong,
                ':locationBox': updatedData.locationBox,
                ':offerType': updatedData.offerType,
                ':selectedDays': updatedData.selectedDays,
                ':startDate': updatedData.startDate,
                ':startTime': updatedData.startTime,
                ':title': updatedData.title
            },
            UpdateExpression: 'set #category = :category , #description = :description , #discount = :discount , #endDate = :endDate , #endTime = :endTime , #latNLong = :latNLong , #locationBox = :locationBox , #offerType = :offerType , #selectedDays = :selectedDays , #startDate = :startDate , #startTime = :startTime, #title = :title'
        }).promise()
    },

    getPromoWithPromoId: function (data) {
        console.log('data', data);
        return ddb.query({
            TableName: 'HS_Promotions',
            ExpressionAttributeValues: {
                ':promo': data.promo,
                ':vendor': data.vendor
            },
            KeyConditionExpression: 'promoId = :promo',
            FilterExpression: 'vendorId = :vendor'
        }).promise()
    },

    addToQR: function (qr, uuid) {
        console.log('qr', qr);
        console.log('uuid', uuid);
        return ddb.put({
            TableName: 'HS_QR',
            Item: {
                'vendorId': qr.vendor,
                'promoId': qr.promo,
                'QRId': uuid,
                'category': qr.type,
                'offerType': qr.offerType,
                'user': qr.user,
                'grabTime': qr.grabTime,
                'userName': qr.userName
            }
        }).promise()
    },

    getQR: function (qr) {
        return ddb.get({
            TableName: 'HS_QR',
            Key: {
                'QRId': qr
            }
        }).promise()
    },

    scanRedeem: function (data) {
        console.log('data', data);
        return ddb.scan({
            TableName: 'HS_Redeem',
            ExpressionAttributeValues: {
                ':promo': data.promo,
                ':user': data.userId
            },
            FilterExpression: 'promoId = :promo and userId = :user'
        }).promise()
    },

    putRedeem: function (data) {
        return ddb.put({
            TableName: 'HS_Redeem',
            Item: {
                'promoId': data.promoId,
                'userId': data.userId,
                'redeemId': data.redeemId,
                'noOfRedeems': data.noOfRedeems
            }
        }).promise()
    },

    updateRedeem: function (data) {
        return ddb.update({
            TableName: 'HS_Redeem',
            Key: {
                'redeemId': data.redeemId
            },
            ExpressionAttributeValues: {
                ':redeem': data.val
            },
            UpdateExpression: 'set noOfRedeems = :redeem'
        }).promise()
    },

    getNoOfRedeems: function (promoId) {
        return ddb.scan({
            TableName: 'HS_Redeem',
            ExpressionAttributeValues: {
                ':promoId': promoId
            },
            FilterExpression: 'promoId = :promoId'
        }).promise()
    }

}