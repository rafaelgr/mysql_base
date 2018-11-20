"use strict";
const Mongoose = require('mongoose');
const userSchema = Mongoose.Schema({
    _id: Mongoose.Schema.Types.ObjectId,
    email: { type: String, required: true, unique: true,
    match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ },
    password: { type: String, required: true }
});

module.exports = Mongoose.model('User', userSchema);