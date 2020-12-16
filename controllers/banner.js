const Banner = require("../models/banner");
const FactoryHandler = require("./FactoryHandler");

exports.addBanner = FactoryHandler.createOne(Banner);

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

exports.updateBanner = FactoryHandler.updateOne(Banner);
exports.deleteBanner = FactoryHandler.deleteOne(Banner);
