const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000"
    ],
    credentials: true,
  })
);

app.use(express.json());


// uploads (safe for vercel)
app.use(
  "/uploads",
  express.static(path.join(process.cwd(), "uploads"))
);


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