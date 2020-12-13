const mongoose = require("mongoose");
const slugify = require("slugify");

const blogSchema = new mongoose.Schema(
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
    display_order: {
      type: Number
    },
    isPublish: {
      type: Boolean,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
);
blogSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

const Blog = mongoose.model("Blog", blogSchema);
module.exports = Blog;
