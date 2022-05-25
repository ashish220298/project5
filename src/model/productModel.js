const { type } = require('express/lib/response');
const mongoose = require('mongoose');


const productSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },

    price: {
        type: Number,
        required: true,

    },
    currencyId: {
        require: true,
        type: String,

    },
    currencyFormat: {
        require: true,
        type: String,
    },
    isFreeShipping: {
        type: Boolean,
        default: false
    },
    productImage: {
        type: String,
        required: true
    },
    installments: {
        type: Number
    },
    style: {
        type: String
    },
    availableSizes: {
        type: [String],
        enum: ["S", "XS", "M", "X", "L", "XXL", "XL"]
    },
    deletedAt: {
        type: Date
    },
    isDeleted: {
        type: Boolean,
        default: false
    }

}, { timestamps: true });


module.exports = mongoose.model('product', productSchema)