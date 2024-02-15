const mongoose = require("mongoose");
const generate = require('../helpers/generate.js');
const forgotPasswordSchema = new mongoose.Schema({
    email: String,
    otp:String,
    expiredAt: {
        type: Date,
        default: Date.now(),
        expireAfterSeconds : 10 * 1
    }
},{
    timestamps: true
});

const forgotPassword = mongoose.model('forgotPassword', forgotPasswordSchema, 'forgotPassword');

module.exports = forgotPassword;