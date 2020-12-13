const express = require("express");
const authController = require("../controllers/user");
const blogController = require("../controllers/blog");
const imageUpload = require("../middleware/multer");

const router = express.Router();

router
  .route("/")
  .post(
    authController.protect,
    authController.restrictTo("user"),
    imageUpload.single("image"),
    blogController.addBlog
  )
  .get(blogController.getAllBlogs);

module.exports = router;
