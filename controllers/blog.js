const Blog = require("../models/blog");

exports.addBlog = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const image = {
      url: `${
        req.connection && req.connection.encrypted ? "https" : "http"
      }://${req.get("host")}/uploads/images/${req.file.filename}`,
      alt: req.body.image.alt,
      caption: req.body.image.caption
    };
    const data = { ...req.body, image, author: userId };
    const blog = await Blog.create(data);
    res.status(201).json({
      message: "success",
      data: blog
    });
  } catch (err) {
    next(err);
    console.log(err);
  }
};

exports.getAllBlogs = async (req, res) => {
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
    const count = await Blog.countDocuments({ ...keyword });
    const blogs = await Blog.find({ ...keyword })
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .populate("author");
    res.status(200).json({
      message: "success",
      page,
      count,
      pages: Math.ceil(count / pageSize),
      data: blogs
    });
  } catch (err) {
    console.log(err);
  }
};
