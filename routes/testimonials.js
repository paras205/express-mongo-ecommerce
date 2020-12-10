const express = require("express");
const authController = require("../controllers/user");
const testimonialsController = require("../controllers/testimonials");

const router = express.Router();

router
  .route("/")
  .post(
    authController.protect,
    authController.restrictTo("user"),
    testimonialsController.addTestimonials
  )
  .get(testimonialsController.getAllTestimonials);

module.exports = router;
