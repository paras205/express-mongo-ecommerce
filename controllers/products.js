const Product = require("../models/product");
const Category = require("../models/Category");

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
