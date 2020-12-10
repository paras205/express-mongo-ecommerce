const express = require("express");
const productController = require("../controllers/products");
const authController = require("../controllers/user");
const upload = require("../middleware/multer");
const router = express.Router();

const imageUpload = upload.fields([
  { name: "image", maxCount: 1 },
  { name: "productImages", maxCount: 8 }
]);

router
  .route("/category")
  .post(
    authController.protect,
    authController.restrictTo("user"),
    upload.single("image"),
    productController.addCategory
  )
  .get(productController.getAllCategory);

router
  .route("/")
  .post(
    authController.protect,
    authController.restrictTo("user"),
    imageUpload,
    productController.addProduct
  )
  .get(productController.getAllProducts);

router
  .route("/:id/reviews")
  .post(authController.protect, productController.createReview);

router.post("/addToCart", authController.protect, productController.addToCart);
router.get("/cart", authController.protect, productController.getAllCartItems);

router
  .route("/order")
  .post(authController.protect, productController.createOrder)
  .get(authController.protect, productController.getUserOrder);

router.get(
  "/admin-orders",
  authController.protect,
  authController.restrictTo("user"),
  productController.getAllOrders
);

module.exports = router;
