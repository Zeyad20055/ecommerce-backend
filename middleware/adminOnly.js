// middleware/adminOnly.js
// Authorization guard: run AFTER `protect`. Restricts a route to
// admin/superadmin roles (useful if you later add non-admin users).

const { error } = require('../utils/apiResponse');

const adminOnly = (req, res, next) => {
  if (!req.admin || !['admin', 'superadmin'].includes(req.admin.role)) {
    return error(res, 403, 'Access denied: admin privileges required');
  }
  next();
};

module.exports = adminOnly;
