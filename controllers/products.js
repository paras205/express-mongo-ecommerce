const Product = require("../models/product");
const Category = require("../models/Category");
const Cart = require("../models/cart");

exports.addCategory = async (req, res, next) => {
  try {
    const data = {
      ...req.body,
      image: `${
        req.connection && req.connection.encrypted ? "https" : "http"
      }://${req.get("host")}/uploads/images/${req.file.filename}`
    };
    const category = await Category.create(data);
    res.status(201).json({
      message: "success",
      data: category
    });
  } catch (err) {
    next(err);
    console.log(err);
  }
};

exports.getAllCategory = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json({
      message: "success",
      data: categories
    });
  } catch (err) {
    console.log(err);
  }
};

exports.addProduct = async (req, res, next) => {
  try {
    let productImages = [];
    if (req.files && req.files.productImages) {
      req.files.productImages.forEach((element) => {
        productImages.push(
          `${
            req.connection && req.connection.encrypted ? "https" : "http"
          }://${req.get("host")}/uploads/images/${element.filename}`
        );
      });
    }
    const product = await Product.create({
      ...req.body,
      image: {
        url: `${
          req.connection && req.connection.encrypted ? "https" : "http"
        }://${req.get("host")}/uploads/images/${req.files.image[0].filename}`,
        alt: req.body.image.alt,
        caption: req.body.image.caption
      },
      productImages
    });
    res.status(201).json({
      message: "success",
      data: product
    });
  } catch (err) {
    next(err);
    console.log(err);
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const pageSize = 10;
    const page = Number(req.query.pageNumber) || 1;
    const keyword = req.query.search
      ? {
          name: {
            $regex: req.query.search,
            $options: "i"
          }
        }
      : {};
    const count = await Product.countDocuments({ ...keyword });
    const products = await Product.find({ ...keyword })
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .populate("category reviews");
    res.status(200).json({
      message: "success",
      page,
      pages: Math.ceil(count / pageSize),
      data: products
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err
    });
  }
};

exports.createReview = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      const alreadyReviewed = product.reviews.find(
        (item) => item.user.toString() === req.user._id.toString()
      );
      if (alreadyReviewed) {
        return next(new AppError("Product already reviewed", 400));
      }
      const review = {
        name: req.user.name,
        comment: req.body.comment
      };
      product.reviews.push(review);
      await product.save();
      res.status(201).json({ message: "Review added" });
    }
  } catch (err) {
    next(err);
    console.log(err);
  }
};

exports.addToCart = async (req, res) => {
  const { productId, quantity, price } = req.body;
  const userId = req.user._id;
  try {
    let cart = await Cart.findOne({ user: userId });

    if (cart) {
      let itemIndex = cart.products.findIndex((p) => p.productId == productId);
      if (itemIndex > -1) {
        let productItem = cart.products[itemIndex];
        productItem.quantity = cart.products[itemIndex].quantity + 1;
        productItem.price =
          cart.products[itemIndex].price * cart.products[itemIndex].quantity;
        cart.products[itemIndex] = productItem;
      } else {
        cart.products.push({ productId, quantity, price });
      }
      const total = cart.products.reduce(
        (total, item) => total + item.price,
        0
      );
      cart.total = total;
      cart = await cart.save();
      return res.status(201).send(cart);
    } else {
      const newCart = await Cart.create({
        user: userId,
        products: [{ productId, quantity, price }]
      });
      return res.status(201).send(newCart);
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong");
  }
};

exports.getAllCartItems = async (req, res) => {
  try {
    const cartItems = await Cart.findOne({ user: req.user._id }).populate(
      "user products.productId"
    );
    res.status(200).json({
      status: "success",
      data: cartItems
    });
  } catch (err) {
    console.log(err);
  }
};
