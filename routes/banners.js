const express = require("express");
const authController = require("../controllers/user");
const bannerController = require("../controllers/banner");
const imageUpload = require("../middleware/multer");

const router = express.Router();

router
  .route("/")
  .post(
    authController.protect,
    authController.restrictTo("user"),
    imageUpload.single("image"),
    bannerController.addBanner
  )
  .get(bannerController.getAllBanner);

router
  .route("/:id")
  .put(
    authController.protect,
    authController.restrictTo("user"),
    bannerController.updateBanner
  )
  .get(bannerController.getBanner)
  .delete(
    authController.protect,
    authController.restrictTo("user"),
    bannerController.deleteBanner
  );

module.exports = router;
