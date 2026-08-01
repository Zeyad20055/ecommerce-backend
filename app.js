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


// =======================
// CORS Configuration
// =======================

app.use(
  cors({
    origin: [
      "https://zeyad20055.github.io",
      "https://chipper-bienenstitch-22252f.netlify.app",
      "http://localhost:5173",
    ],
    credentials: true,
  })
);


// =======================
// Global Middleware
// =======================

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(cookieParser());


// =======================
// Logger (Development)
// =======================

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}


// =======================
// Static Files
// =======================

app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);


// =======================
// Health Check
// =======================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "E-Commerce Dashboard API is running",
  });
});


// =======================
// API Routes
// =======================

app.use("/api/auth", authRoutes);

app.use("/api/products", productRoutes);


// =======================
// Error Handling
// =======================

app.use(notFound);

app.use(errorHandler);


module.exports = app;