const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const SlabSchema = new mongoose.Schema({



    bank_id: {
        type: String,
        trim: true,
        required: true,
    },
    slab_fee: {
        type: String,
        trim: true,
        required: true,
    },
    slabrange: {
        type: String,
        trim: true,
        required: true,
    },
    "7days": {
        type: String,
        trim: true,
        required: true,
    },
    "15days": {
        type: String,
        trim: true,
        required: true,
    },
    "25days": {
        type: String,
        trim: true,
        required: true,
    },
    "30days": {
        type: String,
        trim: true,
        required: true,
    },
    tax: {
        type: String,
        trim: true,
        required: true,
    },
    orderofslab: {
        type: String,
        trim: true,
        required: true,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    updated_at: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Slab", SlabSchema);


