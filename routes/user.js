const express = require("express");
const authController = require("../controllers/user");
const imageUpload = require("../middleware/multer");

const router = express.Router();

router.post("/register", imageUpload.single("image"), authController.register);
router.post("/login", authController.login);

module.exports = router;
