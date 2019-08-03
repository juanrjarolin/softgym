const {Schema, model} = require('mongoose');

const UserSessionSchema = new Schema({
    userId: {
        type: Number,
        default: -1
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