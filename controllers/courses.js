const Courses = require("../models/courses");

exports.addCourses = async (req, res, next) => {
  try {
    const data = {
      ...req.body,
      image: {
        url: `${
          req.connection && req.connection.encrypted ? "https" : "http"
        }://${req.get("host")}/uploads/images/${req.file.filename}`,
        alt: req.body.image.alt,
        caption: req.body.image.caption
      }
    };
    const course = await Courses.create(data);
    res.status(201).json({
      message: "success",
      data: course
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.getAllCourses = async (req, res) => {
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
    const count = await Courses.countDocuments({ ...keyword });
    const courses = await Courses.find({ ...keyword })
      .limit(pageSize)
      .skip(pageSize * (page - 1));
    res.status(200).json({
      message: "success",
      page,
      count,
      pages: Math.ceil(count / pageSize),
      data: courses
    });
  } catch (err) {
    console.log(err);
  }
};
