const Product = require("../models/Product");
const { success } = require("../utils/apiResponse");


// @desc Get all products
// @route GET /api/products
const getProducts = async (req, res) => {
  try {
    const products = await Product.find();

    return success(
      res,
      200,
      "Products fetched successfully",
      products
    );

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// @desc Get single product
// @route GET /api/products/:id
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return success(
      res,
      200,
      "Product fetched successfully",
      product
    );

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// @desc Create product
// @route POST /api/products
const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      quantity,
    } = req.body;


    const product = await Product.create({
      name,
      description,
      price,
      category,
      quantity,
      image: req.file
        ? `/uploads/${req.file.filename}`
        : "",
    });


    return success(
      res,
      201,
      "Product created successfully",
      product
    );


  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// @desc Update product
// @route PUT /api/products/:id
const updateProduct = async (req, res) => {
  try {

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );


    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }


    return success(
      res,
      200,
      "Product updated successfully",
      product
    );


  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// @desc Delete product
// @route DELETE /api/products/:id
const deleteProduct = async (req, res) => {
  try {

    const product = await Product.findByIdAndDelete(
      req.params.id
    );


    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }


    return success(
      res,
      200,
      "Product deleted successfully"
    );


  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// @desc Product statistics
// @route GET /api/products/stats/summary
const getProductStats = async (req, res) => {
  try {

    const totalProducts = await Product.countDocuments();

    const totalQuantity = await Product.aggregate([
      {
        $group: {
          _id: null,
          total: {
            $sum: "$quantity",
          },
        },
      },
    ]);


    return success(
      res,
      200,
      "Product statistics fetched successfully",
      {
        totalProducts,
        totalQuantity:
          totalQuantity.length
            ? totalQuantity[0].total
            : 0,
      }
    );


  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
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