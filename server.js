"use strict";
const Dotenv = require('dotenv');
const App = require('./app');
const Winston = require('./winston');
const Pack = require('./package.json');
const Mongoose = require('mongoose');

Dotenv.config();
Mongoose.connect(process.env.BASE_MONGOOSE_CONNECTION, { useNewUrlParser: true });

var apiPort = process.env.BASE_PORT || 8088;

App.listen(apiPort, () => {
    Winston.info(Pack.name + " VRS: " + Pack.version);
    Winston.info("Listening on port " + apiPort + "...");
});