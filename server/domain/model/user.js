var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var userSchema = new Schema({
    login: {
        type: String,
        required: true,
        trim: true
    },
    creationDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    lastAccess: {
        type: Date,
        required: true,
        default: Date.now
    },
    active: {
        type: Boolean,
        required: true,
        default: true
    }
});

module.exports = {
    User: mongoose.model('user', userSchema),
    UserSchema: userSchema
};
