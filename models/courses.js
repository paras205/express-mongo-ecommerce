const mongoose = require("mongoose");
const slugify = require("slugify");

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
    type: Number,
    required: true
  },
  mobileNumber: {
    type: Number,
    required: true
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
  },
  discount: {
    type: Number
  },
  totalPriceWithDiscount: {
    type: Number
  }
});
const reviewSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    email: { type: String, required: true, unique: true }
  },
  {
    timestamps: true
  }
);

const courseSchema = new mongoose.Schema(
  {
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
    startDate: {
      type: Date
    },
    videoes: {},
    appliedBy: [studentSchema],
    reviews: [reviewSchema]
  },
  { timestamps: true }
);

courseSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

const Courses = mongoose.model("Courses", courseSchema);
module.exports = Courses;
