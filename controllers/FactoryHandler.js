const catchAsync = require("../middleware/catchAysnc");
const AppError = require("../utils/appError");

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      return next(new AppError("No document found with that id", 404));
    }
    res.status(204).json({
      message: "success",
      data: null
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!doc) {
      return next(new AppError("No document found with that id", 404));
    }
    res.status(200).json({
      message: "success",
      data: doc
    });
  });

exports.getOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findById(req.params.id);
    res.status(200).json({
      message: "success",
      data: doc
    });
  });

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
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
    const count = await Model.countDocuments({ ...keyword });
    const doc = await Model.find({ ...keyword })
      .limit(pageSize)
      .skip(pageSize * (page - 1));
    res.status(200).json({
      message: "success",
      page,
      count,
      pages: Math.ceil(count / pageSize),
      data: doc
    });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create({
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
      data: doc
    });
  });
