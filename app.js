const express = require("express");
const cors = require("cors");

const app = express();


// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://your-frontend-domain.vercel.app"
    ],
    credentials: true
  })
);

app.use(express.json());


// Routes
const productRoutes = require("./routes/product.routes");
const userRoutes = require("./routes/user.routes");

app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);


// Test API
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "E-Commerce Dashboard API is running"
  });
});


module.exports = app;