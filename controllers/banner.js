const Banner = require("../models/banner");
const FactoryHandler = require("./FactoryHandler");

exports.addBanner = FactoryHandler.createOne(Banner);
exports.getAllBanner = FactoryHandler.getAll(Banner);
exports.getBanner = FactoryHandler.getOne(Banner);
exports.updateBanner = FactoryHandler.updateOne(Banner);
exports.deleteBanner = FactoryHandler.deleteOne(Banner);
