const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  mobileNumber: {
    type: String,
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course"
  },
  percentage: {
    type: Number,
    required: true
  },
  schedule: {
    type: Date
  },
  message: {
    type: String
  }
});
const reviewSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    comment: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  slug: {
    type: String
  },
  image: {
    alt: {
      type: String,
      required: true
    },
    caption: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    }
  },
  description: {
    type: String,
    required: true
  },
  isPublish: {
    type: Boolean,
    required: true
  },
  display_order: {
    type: Number
  },
  syllabus: {
    type: String
  },
  overView: {
    type: String
  },
  price: {
    type: Number
  },
  discount: {
    type: Number
  },
  totalPriceWithDiscount: {
    type: Number
  },
  startDate: {
    type: Date
  },
  appliedBy: [studentSchema]
});

const Courses = mongoose.model("Courses", courseSchema);
module.exports = Courses;
