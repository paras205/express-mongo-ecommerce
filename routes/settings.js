const express = require("express");
const authController = require("../controllers/user");
const settingController = require("../controllers/settings");

const router = express.Router();

router.route(
  "/",
  authController.protect,
  authController.restrictTo("user"),
  settingController.addSettings
);

module.exports = router;
