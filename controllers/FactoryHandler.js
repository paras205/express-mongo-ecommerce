const AppError = require("../utils/appError");

exports.deleteOne = (Model) => async (req, res, next) => {
  try {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      return next(new AppError("No document found with that id", 404));
    }
    res.status(204).json({
      status: "success",
      data: null
    });
  } catch (err) {
    console.log(err);
  }
};

exports.updateOne = (Model) => async (req, res, next) => {
  try {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!doc) {
      return next(new AppError("No document found with that id", 404));
    }
    res.status(200).json({
      status: "success",
      data: doc
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.getOne = (Model) => async (req, res, next) => {};
exports.getAll = (Model) => async (req, res, next) => {};
exports.createOne = (Model) => async (req, res, next) => {
  try {
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
  } catch (err) {
    console.log(err);
    next(err);
  }
};
