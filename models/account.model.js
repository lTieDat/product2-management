const mongoose = require("mongoose");
const generate = require('../helpers/generate.js');
const accountSchema = new mongoose.Schema({
    fullName: String,
    email: String,
    password: String,
    token: {
        type: String,
        default: generate.genenrateRandomString(20)
    },
    phone: String,
    avatar: String,
    role_id: String,
    status:String,
    deleted:{
        type: Boolean,
        default: false
    },
    deletedBy: {
        deletedAt: Date,
        account_id:String
    },
    createdBy:{
        createdAt: {
            type: Date, 
            default: Date.now
        },
        account_id:String
    }
},{
    timestamps: true
});

const Account = mongoose.model('Account', accountSchema, 'accounts');

module.exports = Account;