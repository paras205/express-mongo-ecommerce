const Banner = require("../models/banner");

exports.addBanner = async (req, res, next) => {
  try {
    const banner = await Banner.create({
      ...req.body,
      image: {
        url: `${
          req.connection && req.connection.encrypted ? "https" : "http"
        }://${req.get("host")}/uploads/images/${req.file.filename}`,
        alt: req.body.image.alt,
        caption: req.body.image.caption
      }
    });
    res.status(201).json({
      message: "success",
      data: banner
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.getAllBanner = async (req, res) => {
  try {
    const banners = await Banner.find();
    res.status(200).json({
      message: "success",
      data: banners
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getBanner = async (req, res) => {
  try {
    const banner = await Banner.findOne({ slug: req.params.slug });
    res.status(200).json({
      message: "success",
      data: banner
    });
  } catch (err) {
    console.log(err);
  }
};

exports.updateBanner = async (req, res) => {};
exports.deleteBanner = async (req, res) => {};
