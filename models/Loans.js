const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const LoanSchema = new mongoose.Schema({


 
    userid: {
        type: String,
        ref : 'User',
        required: false,
    },
    user_name: {
        type: String,
        ref : 'User',
        required: false,
    },
    loan_type: {
        type: String,
        trim: true,
        required: false,
    },
    applied_date: {
        type: Date,
        default: Date.now,
    },
    loan_amount: {
        type: Number,
        default: 0
    },
    costprice: {
        type: Number,
        default: 0
    },
    tenure: {
        type: Number,
        default: 0
    },
    plan: {
        type: String,
        trim: true,
        required: false,
    },
    bank_id: {
        type: String,
        trim: true,
        required: false,
    },
    distributor: {
        type: String,
        trim: true,
        required: false,
    },
    goods_image: {
        type: String,
        trim: true,
        required: false,
    },
    invoice_image: {
        type: String,
        trim: true,
        required: false,
    },
    stock_image: {
        type: String,
        trim: true,
        required: false,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    updated_at: {
        type: Date,
        default: Date.now,
    },
    phone_number: {
        type: String,
        trim: true,
        required: false,
    },
    invoice_number: {
        type: String,
        trim: true,
        required: false,
    },
    destination_location: {
        type: String,
        trim: true,
        required: false,
    },
    status: {
        type: String,
        trim: true,
        default: 'pending',
    },
    comments: {
        type: String,
        trim: true,
        required: false,
    },
    due_date: {
        type: String,
        trim: true,
        required: false,
    },
    phone_no:{
        type: String,
        trim: true,
        required: false,
    },
    email:{
        type: String,
        trim: true,
        required: false,
    },
    loan_limit: {
        type: Number,
        default: 100000
    },
    qtyNewProduct: {
        type: Number,
        default: 0
    },
    currentInventory: {
        type: Number,
        default: 0
    },
    mblPercentage: {
        type: Number,
        default: 0
    },
    goodsImage: {
        type: String,
        trim: true,
        required: false,
    },
    invocieImage: {
        type: String,
        trim: true,
        required: false,
    },
});

module.exports = mongoose.model("Loan", LoanSchema);