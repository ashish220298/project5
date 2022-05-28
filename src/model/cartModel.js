const { type } = require('express/lib/response');
const mongoose = require('mongoose');

const ObjectId = mongoose.Schema.Types.ObjectId
const cartSchema = new mongoose.Schema({

userId:{
    required: true,
    type: ObjectId,
    ref: 'users'
},
items: [{
    productId: {
        required: true,
        type: ObjectId,
        ref: 'product'
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    }
  }],
  totalPrice: {
      type: Number,
      required: true
  },
  totalItems:{
      type:Number,
      required: true
  }

}, { timestamps: true });


module.exports = mongoose.model('cart', cartSchema)