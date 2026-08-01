// middleware/validate.js
// Runs after an express-validator chain; collects any validation errors
// and returns a clean 400 response instead of letting them fall through.

const { validationResult } = require('express-validator');
const { error } = require('../utils/apiResponse');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const message = errors
      .array()
      .map((e) => e.msg)
      .join(', ');
    return error(res, 400, message);
  }
  next();
};

module.exports = validate;
