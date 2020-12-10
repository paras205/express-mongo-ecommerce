const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({});

const Services = mongoose.model("Services", serviceSchema);
module.exports = Services;
