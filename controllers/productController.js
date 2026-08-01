// controllers/productController.js
// Full CRUD for products, plus search/sort/pagination for the
// dashboard's "All Products" table and the public product listing.

const fs = require('fs');
const path = require('path');
const Product = require('../models/Product');
const { success, error } = require('../utils/apiResponse');

// @desc    Get all products (search, sort, pagination)
// @route   GET /api/products
// @access  Public
// Query params: search, category, sort ('newest'|'oldest'|'price_asc'|'price_desc'),
//               page (default 1), limit (default 10)
const getProducts = async (req, res, next) => {
  try {
    const { search, category, sort = 'newest', page = 1, limit = 10 } = req.query;

    const filter = {};
    if (search) {
      filter.$text = { $search: search };
    }
    if (category) {
      filter.category = category;
    }

    const sortMap = {
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 },
      price_asc: { price: 1 },
      price_desc: { price: -1 },
    };
    const sortBy = sortMap[sort] || sortMap.newest;

    const pageNum = Math.max(Number(page), 1);
    const limitNum = Math.max(Number(limit), 1);
    const skip = (pageNum - 1) * limitNum;

    const [products, total] = await Promise.all([
      Product.find(filter).sort(sortBy).skip(skip).limit(limitNum),
      Product.countDocuments(filter),
    ]);

    return success(res, 200, 'Products fetched', products, {
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum) || 1,
      limit: limitNum,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get a single product by id
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return error(res, 404, 'Product not found');
    }
    return success(res, 200, 'Product fetched', product);
  } catch (err) {
    next(err);
  }
};

// @desc    Create a new product (with image upload)
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res, next) => {
  try {
    if (!req.file) {
      return error(res, 400, 'Product image is required');
    }

    const { name, description, price, category, quantity } = req.body;

    const product = await Product.create({
      name,
      description,
      price,
      category,
      quantity,
      image: `/uploads/${req.file.filename}`,
    });

    return success(res, 201, 'Product created successfully', product);
  } catch (err) {
    next(err);
  }
};

// @desc    Update a product (image optional)
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return error(res, 404, 'Product not found');
    }

    const { name, description, price, category, quantity } = req.body;

    if (name !== undefined) product.name = name;
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = price;
    if (category !== undefined) product.category = category;
    if (quantity !== undefined) product.quantity = quantity;

    // If a new image was uploaded, replace it and delete the old file
    if (req.file) {
      const oldImagePath = path.join(__dirname, '..', product.image);
      if (fs.existsSync(oldImagePath)) {
        fs.unlink(oldImagePath, () => {});
      }
      product.image = `/uploads/${req.file.filename}`;
    }

    const updated = await product.save();
    return success(res, 200, 'Product updated successfully', updated);
  } catch (err) {
    next(err);
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return error(res, 404, 'Product not found');
    }

    const imagePath = path.join(__dirname, '..', product.image);
    if (fs.existsSync(imagePath)) {
      fs.unlink(imagePath, () => {});
    }

    await product.deleteOne();
    return success(res, 200, 'Product deleted successfully');
  } catch (err) {
    next(err);
  }
};

// @desc    Dashboard stats: total products, total stock, recent products
// @route   GET /api/products/stats/summary
// @access  Private/Admin
const getProductStats = async (req, res, next) => {
  try {
    const totalProducts = await Product.countDocuments();
    const stockAgg = await Product.aggregate([
      { $group: { _id: null, totalQuantity: { $sum: '$quantity' } } },
    ]);
    const totalQuantity = stockAgg[0]?.totalQuantity || 0;
    const recentProducts = await Product.find().sort({ createdAt: -1 }).limit(5);
    const categoriesCount = (await Product.distinct('category')).length;

    return success(res, 200, 'Stats fetched', {
      totalProducts,
      totalQuantity,
      categoriesCount,
      recentProducts,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductStats,
};
