// app.js
// Configures the Express application: global middleware, routes,
// static file serving for uploaded images, and error handlers.

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const path = require("path");

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");

const app = express();

// Core middleware
app.use(
  cors({
    origin: "https://chipper-bienenstitch-22252f.netlify.app",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// Serve uploaded product images statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Health check
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "E-Commerce Dashboard API is running",
  });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

// 404 + centralized error handler
app.use(notFound);
app.use(errorHandler);

module.exports = app;