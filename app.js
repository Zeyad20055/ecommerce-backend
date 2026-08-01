const express = require("express");

const app = express();

app.use(express.json());


// Routes
const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes");


app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);


app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "E-Commerce Dashboard API is running"
  });
});


module.exports = app;