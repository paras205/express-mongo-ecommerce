const mongoose = require("mongoose");

const testimonialSchema = new mongoose.Schema({});

const Testimonials = mongoose.model("Testimonial", testimonialSchema);

module.exports = Testimonials;
