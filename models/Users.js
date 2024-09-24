// create user model
// Language: javascript
// Path: backend\models\Users.js

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const Users = new mongoose.Schema({




    name: {
        type: String,
        trim: true,
        required: true,
    },
    userkey: {
        type: String,
        trim: true,
        required: false,
    },
    email: {
        type: String,
        trim: true,
        required: true,
    },
    rolename: {
        type: String,
        trim: true,
        required: false,
    },
    phone_no: {
        type: String,
        trim: true,
        required: false,
    },
    password: {
        type: String,
        trim: true,
        required: true,
    },
    aproved_loan : {
        type: Number,
        default: 0
    },
    pending_loan : {
        type: Number,
        default: 0
    },
    loan_limit : {
        type: Number,
        default: 100000
    },
    rejected_loan : {
        type: Number,
        default: 0
    },
    role_name : {
        type: String,
        trim: true,
        default: "User"
    },
    total_loan : {
        type: Number,
        default: 0
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    updated_at: {
        type: Date,
        default: Date.now,
    },
    isVerified: {
        type: String,
        trim: true,
        default: '1',
    },
    user_role: {
        type: String,
        trim: true,
        default: '2',
        required: true,
    },
    bankid: {
        type: String,
        trim: true,
        required: false,
        default: '1',
    },
    last_activity: {
        type: String,
        trim: true,
        default: Date.now,
    },
    fatherName: {
        type: String,
        trim: true,
        required: false,
    },
    motherName: {
        type: String,
        trim: true,
        required: false,
    },
    address: {
        type: String,
        trim: true,
        required: false,
    },
    cnic: {
        type: String,
        trim: true,
        required: false,
    },
    accountType: {
        type: String,
        trim: true,
    },
    age: {
        type: String,
        trim: true,
        required: false
    }


},
    {
        collation: "Users"});

module.exports = mongoose.model("Users", Users);
