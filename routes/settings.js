const express = require("express");
const authController = require("../controllers/user");
const settingController = require("../controllers/settings");
const imageUpload = require("../middleware/multer");

const router = express.Router();

router
  .route(
    "/",
    authController.protect,
    authController.restrictTo("user"),
    imageUpload.single("logo"),
    settingController.updateSettings
  )
  .get(settingController.getSettings);

module.exports = router;
