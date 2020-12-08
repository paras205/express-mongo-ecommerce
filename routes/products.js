const express = require("express");
const productController = require("../controllers/products");
const upload = require("../middleware/multer");
const router = express.Router();

const imageUpload = upload.fields([
  { name: "image", maxCount: 1 },
  { name: "productImages", maxCount: 8 }
]);

router
  .route("/category")
  .post(upload.single("image"), productController.addCategory)
  .get(productController.getAllCategory);

router
  .route("/")
  .post(imageUpload, productController.addProduct)
  .get(productController.getAllProducts);

module.exports = router;
