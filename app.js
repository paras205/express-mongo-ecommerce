const express = require("express");
const morgan = require("morgan");

const productRoutes = require("./routes/products");

const app = express();
app.use(express.json());
// app.use(express.static(__dirname, "public"));
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use("/api/products", productRoutes);

module.exports = app;
