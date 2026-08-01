// validations/authValidation.js
// express-validator rules for the auth routes (currently: login).

const { body } = require('express-validator');

const loginValidation = [
  body('email').isEmail().withMessage('Please provide a valid email').normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
];

module.exports = { loginValidation };
