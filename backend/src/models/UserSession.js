const {Schema, model} = require('mongoose');
const UserSessionSchema = new Schema({
    userToken:{
        type: String
    },
    
    dateSession: {
        type: String
    },

    actions: [String],

    dateActions: String,

    isDelete: {
        type: Boolean,
        default: false
    }
});

module.exports = model('UserSession', UserSessionSchema);