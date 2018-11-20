"use strict";
const Mongoose = require('mongoose');
const orderSchema = Mongoose.Schema({
    _id: Mongoose.Schema.Types.ObjectId,
    product: { type: Mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, default: 1 }
});

module.exports = Mongoose.model('Order', orderSchema);