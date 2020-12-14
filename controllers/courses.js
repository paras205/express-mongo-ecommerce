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
      .skip(pageSize * (page - 1))
      .populate("reviews");
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

exports.enrollClass = async (req, res, next) => {
  try {
    const {
      email,
      name,
      phone,
      mobileNumber,
      percentage,
      schedule,
      message
    } = req.body;
    const course = await Courses.findById(req.params.courseId);
    if (!course || course.length === 0)
      return next(new AppError("course not found"));
    const applied = course.appliedBy.filter((item) => item.email === email);
    if (applied.length > 0) {
      return next(new AppError("You already applied for this course"));
    }
    const enroll = {
      email,
      name,
      phone,
      mobileNumber,
      percentage,
      schedule,
      message
    };
    if (percentage >= 90) {
      enroll.discount = 15;
    } else if (percentage >= 80 && percentage < 90) {
      enroll.discount = 10;
    } else if (percentage >= 70 && percentage < 80) {
      enroll.discount = 5;
    } else {
      enroll.discount = 2;
    }
    enroll.totalPriceWithDiscount =
      course.price - (enroll.discount / 100) * course.price;

    course.appliedBy.push(enroll);
    await course.save();
    res.status(201).json({ message: "successfully enrolled " });
  } catch (err) {
    console.log(err);
  }
};

exports.addReview = async (req, res, next) => {
  try {
    const { name, email, rating, comment } = req.body;
    const course = await Courses.findById(req.params.id);
    if (!course || course.length === 0)
      return next(new AppError("course not found"));
    const alreadyReviewed = course.reviews.filter(
      (item) => item.email === email
    );
    if (alreadyReviewed.length > 0) {
      return next(new AppError("Course already reviewed"));
    }
    const review = {
      name,
      rating: Number(rating),
      comment,
      email
    };
    course.reviews.push(review);
    course.numReviews = course.reviews.length;
    course.rating =
      course.reviews.reduce((acc, item) => item.rating + acc, 0) /
      course.reviews.length;
    await course.save();
    res.status(201).json({
      message: "Review added"
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getEnrolledStudents = async (req, res) => {
  try {
    const courses = await Courses.find();
    const enrolledStudents = courses.map((item) => {
      return item.appliedBy;
    });
    res.status(200).json({
      message: "success",
      data: enrolledStudents,
      count: enrolledStudents.length
    });
  } catch (err) {
    console.log(err);
  }
};
