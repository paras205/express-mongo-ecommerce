const APIFeatures = require("../middleware/AppFeatures");
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

exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;
    if (!doc) {
      return next(new AppError("No document found with that id", 404));
    }
    res.status(200).json({
      message: "success",
      data: doc
    });
  });

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    const keyword = req.query.search
      ? {
          name: {
            $regex: req.query.search,
            $options: "i"
          }
        }
      : {};
    const count = await Model.countDocuments({ ...keyword });
    const features = new APIFeatures(Model.find({ ...keyword }), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const doc = await features.query;
    res.status(200).json({
      message: "success",
      count,
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
