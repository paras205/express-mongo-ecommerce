const Setting = require("../models/settings");

exports.getSettings = async (req, res) => {
  try {
    const settings = await Setting.find();
    res.status(200).json({
      message: "success",
      data: settings
    });
  } catch (err) {
    console.log(err);
  }
};

exports.updateSettings = async (req, res, next) => {
  try {
    const logo = {
      url: `${
        req.connection && req.connection.encrypted ? "https" : "http"
      }://${req.get("host")}/uploads/images/${req.file.filename}`,
      alt: req.body.logo.alt,
      caption: req.body.logo.caption
    };
    let body = { ...req.body, logo, updatedBy: req.user._id };
    let id =
      req.params != undefined && req.params.id != undefined
        ? req.params.id
        : null;
    if (id == null) {
      const set = await Setting.find();
      if (set.length == 0) {
        const cur = await Setting.create(body);
        id = cur._id;
      } else {
        id = set[0]._id;
      }
    }
    body.updatedBy = req.user._id;
    const query = await Setting.findOneAndUpdate({ _id: id }, body, {
      new: true
    });
    res.status(201).json({
      status: "success",
      data: query
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};
