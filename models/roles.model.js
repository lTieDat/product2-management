const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema({
    title: String,
    permissions:{
        type: Array,
        default: []
    },
    description: String,
    deletedAt: Date,
    position: Number,
    deleted:{
        type: Boolean,
        default: false
    }
},{
    timestamps: true
});

const Role = mongoose.model('Role', roleSchema, 'roles');

module.exports = Role;