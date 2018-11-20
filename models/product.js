"use strict";
const Mongoose = require('mongoose');
const productSchema = Mongoose.Schema({
    _id: Mongoose.Schema.Types.ObjectId,
    name: {type: String, required: true},
    price: {type: Number, required: true, default: 1}
});

module.exports = Mongoose.model('Product', productSchema);