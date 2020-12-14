const express = require("express");
const authController = require("../controllers/user");
const courseController = require("../controllers/courses");
const imageUpload = require("../middleware/multer");

const router = express.Router();

router
  .route("/")
  .post(
    authController.protect,
    authController.restrictTo("user"),
    imageUpload.single("image"),
    courseController.addCourses
  )
  .get(courseController.getAllCourses);

router.post("/:courseId/enroll", courseController.enrollClass);

router.post("/:id/reviews", courseController.addReview);

router.get("/enrolledStudent", courseController.getEnrolledStudents);

module.exports = router;
