const express = require("express");
const router = express.Router();

const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductStats,
} = require("../controllers/productController");


const {
  productValidation,
  productUpdateValidation,
} = require("../validations/productValidation");


const validate = require("../middleware/validate");
const protect = require("../middleware/auth");
const adminOnly = require("../middleware/adminOnly");
const upload = require("../middleware/upload");


// Optional image upload
const optionalUpload = (req, res, next) => {
  upload.single("image")(req, res, (err) => {
    if (err) return next(err);
    next();
  });
};


// Routes

router.get(
  "/stats/summary",
  protect,
  adminOnly,
  getProductStats
);


router.get(
  "/",
  getProducts
);


router.get(
  "/:id",
  getProductById
);


router.post(
  "/",
  protect,
  adminOnly,
  optionalUpload,
  productValidation,
  validate,
  createProduct
);


router.put(
  "/:id",
  protect,
  adminOnly,
  optionalUpload,
  productUpdateValidation,
  validate,
  updateProduct
);


router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteProduct
);


module.exports = router;