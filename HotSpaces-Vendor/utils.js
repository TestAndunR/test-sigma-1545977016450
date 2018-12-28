module.exports = {
    authorize: function (event, callback) {
        if (!event.headers || !event.headers["Authorization"] || event.headers["Authorization"] !== 'hotspaces2018#') {
            callback(null, {
                "isBase64Encoded": true,
                "statusCode": 403,
                "headers": {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "*"
                },
                "body": 'Authorization failed'
            });
        } else {
            return true;
        }
    }
}