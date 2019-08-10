const {Schema, model} = require('mongoose');

const UserSessionSchema = new Schema({
    userToken:{
        type: String
    },
    
    timestamp: {
        type: Date,
        default: Date.now
    },
    isDelete: {
        type: Boolean,
        default: false
    }
});

module.exports = model('UserSession', UserSessionSchema);