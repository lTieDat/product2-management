const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema({
    title: String,
    permissions:{
        type: Array,
        default: []
    },
    description: String,
    position: Number,
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

const Role = mongoose.model('Role', roleSchema, 'roles');

module.exports = Role;