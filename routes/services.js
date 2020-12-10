const express = require("express");
const authController = require("../controllers/user");
const serviceController = require("../controllers/services");

const router = express.Router();

router
  .route("/")
  .post(
    authController.protect,
    authController.restrictTo("user"),
    serviceController.addService
  )
  .get(serviceController.getAllServices);

module.exports = router;
