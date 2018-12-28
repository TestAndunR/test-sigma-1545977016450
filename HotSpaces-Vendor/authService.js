let axios = require('axios');

module.exports = {
    
    validateUser: function (userUUID, userName, callback) {
        let headers = {};
        headers['Authorization'] = 'hotspacesAdmin2018#';
        axios.get('https://us-central1-hotspa-beta.cloudfunctions.net/user/' + userUUID, { headers: headers }).then((response) => {
            if (response.data["username"] == userName) {
                callback({ validated: true, error: null });
            } else {
                callback({ validated: false, error: null });
            }
        }).catch((err) => {
            console.log(err);
            callback({ validated: false, error: err });
        });
    },
}