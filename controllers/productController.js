// @desc    Create a new product
// @route   POST /api/products
// @access  Private/Admin

const createProduct = async (req, res, next) => {
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
      image: req.file ? `/uploads/${req.file.filename}` : "",
    });

    return success(
      res,
      201,
      "Product created successfully",
      product
    );

  } catch (err) {
    console.error("CREATE PRODUCT ERROR:", err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};