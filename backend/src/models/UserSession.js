const {Schema, model} = require('mongoose');
const mongoose = require('mongoose');
require('mongoose-moment')(mongoose);

const UserSessionSchema = new Schema({
    userToken:{
        type: String
    },
    
    dateSession: {
        type: String
    },

    actions: [String],

    dateActions: 'Moment',

    isDelete: {
        type: Boolean,
        default: false
    }
});

module.exports = model('UserSession', UserSessionSchema);