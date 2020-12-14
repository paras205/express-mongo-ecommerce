const Courses = require("../models/courses");
const AppError = require("../utils/appError");

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

exports.enrollClass = async (req, res) => {
  try {
    const course = await Courses.findById(req.params.courseId);
    const applied = course.appliedBy.filter((item) => item.email === email);
    if (applied.length > 0) {
      return next(new AppError("You already applied for this course"));
    }
    const enroll = {
      email: req.body.email,
      name: req.body.name,
      phone: req.body.phone,
      mobileNumber: req.body.mobileNumber,
      course: req.body.course,
      percentage: req.body.percentage,
      schedule: req.body.schedule,
      message: req.body.message
    };
    course.appliedBy.push(enroll);
    await Courses.save();
    res.status(201).json({ message: "successfully enrolled " });
  } catch (err) {
    console.log(err);
  }
};

exports.addReview = async (req, res) => {};
