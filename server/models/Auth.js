var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var AuthSchema = new Schema({
    email: {
        type: String,
        default: ''
    },
    password: {
        type: String,
        default: ''
    },
    name: {
        type: String,
        default: ''
    },
    department: {
        type: String,
        default: ''
    },
    status: {
        type: Number,
        default: 1
    },
    created_on: {
        type: Number,
        default: 0
    },
    updated_on: {
        type: Number,
        default: 0
    }
});
module.exports = mongoose.model('Auth', AuthSchema, 'auth');