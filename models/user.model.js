const mongoose = require("mongoose");
const generate = require('../helpers/generate.js');
const userSchema = new mongoose.Schema({
    fullName: String,
    email: String,
    password: String,
    tokenUser: {
        type: String,
        default: generate.genenrateRandomString(20)
    },
    phone: String,
    avatar: String,
    status:{
        type :String,
        default: "active"
    },
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

const User = mongoose.model('User', userSchema, 'users');

module.exports = User;