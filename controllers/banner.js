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
    const count = await Banner.countDocuments({ ...keyword });
    const banners = await Banner.find({ ...keyword })
      .limit(pageSize)
      .skip(pageSize * (page - 1));
    res.status(200).json({
      message: "success",
      page,
      count,
      pages: Math.ceil(count / pageSize),
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
