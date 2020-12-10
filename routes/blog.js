const express = require("express");
const authController = require("../controllers/user");
const blogController = require("../controllers/blog");

const router = express.Router();

router
  .route("/")
  .post(
    authController.protect,
    authController.restrictTo("user"),
    blogController.addBlog
  )
  .get(blogController.getAllBlogs);

module.exports = router;
