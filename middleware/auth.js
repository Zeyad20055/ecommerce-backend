// middleware/auth.js
// Verifies the JWT (from the httpOnly cookie or Authorization header),
// loads the admin, and attaches it to req.admin for downstream handlers.

const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const { error } = require('../utils/apiResponse');

const protect = async (req, res, next) => {
  try {
    let token = req.cookies?.token;

    if (!token && req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return error(res, 401, 'Not authorized, no token provided');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.id);

    if (!admin) {
      return error(res, 401, 'Not authorized, admin no longer exists');
    }

    req.admin = admin;
    next();
  } catch (err) {
    return error(res, 401, 'Not authorized, invalid or expired token');
  }
};

module.exports = protect;
