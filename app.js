const express = require("express");
const morgan = require("morgan");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorHanlder");
const productRoutes = require("./routes/products");
const userRoutes = require("./routes/user");
const bannerRoutes = require("./routes/banners");
const servicesRoutes = require("./routes/services");
const testimonialsRoutes = require("./routes/testimonials");
const blogRoutes = require("./routes/blog");
const courseRoutes = require("./routes/courses");
const settingRoutes = require("./routes/settings");

const app = express();
app.use(express.json());
// app.use(express.static(__dirname, "public"));
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/banners", bannerRoutes);
app.use("/api/services", servicesRoutes);
app.use("/api/testimonials", testimonialsRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/settings", settingRoutes);

app.all("*", (req, res, next) => {
  next(new AppError("Route not found", 404));
});

app.use(globalErrorHandler);

module.exports = app;
