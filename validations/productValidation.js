// validations/productValidation.js
// express-validator rules for creating/updating products.

const { body } = require('express-validator');

const productValidation = [
  body('name').trim().notEmpty().withMessage('Product name is required')
    .isLength({ max: 120 }).withMessage('Product name is too long'),
  body('description').trim().notEmpty().withMessage('Product description is required')
    .isLength({ max: 2000 }).withMessage('Description is too long'),
  body('price').notEmpty().withMessage('Price is required')
    .isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('quantity').notEmpty().withMessage('Quantity is required')
    .isInt({ min: 0 }).withMessage('Quantity must be a non-negative integer'),
];

// Same rules but every field optional — used on PUT/update
const productUpdateValidation = [
  body('name').optional().trim().isLength({ max: 120 }).withMessage('Product name is too long'),
  body('description').optional().trim().isLength({ max: 2000 }).withMessage('Description is too long'),
  body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('category').optional().trim().notEmpty().withMessage('Category cannot be empty'),
  body('quantity').optional().isInt({ min: 0 }).withMessage('Quantity must be a non-negative integer'),
];

module.exports = { productValidation, productUpdateValidation };
