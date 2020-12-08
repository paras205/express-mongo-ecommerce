const mongoose = require("mongoose");
const slugify = require("slugify");

const reviewSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    rating: {
      type: Number,
      required: true
    },
    comment: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },
    slug: {
      type: String
    },
    sku: {
      type: String
    },
    image: {
      type: String,
      required: true
    },
    productImages: [{ type: String }],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category"
    },
    description: {
      type: String,
      required: true
    },
    isPublish: {
      type: Boolean,
      required: true
    },
    countInStock: {
      type: Number,
      required: true
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      set: (val) => Math.round(val * 10) / 10
    },
    ratingsQuantity: {
      type: Number,
      default: 0
    },
    reviews: [reviewSchema],
    price: {
      type: Number,
      required: true
    },
    discount: {
      type: Number
    }
  },
  { timestamps: true }
);

productSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
