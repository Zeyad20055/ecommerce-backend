// utils/apiResponse.js
// Small helpers so every controller returns JSON in the same shape:
// { success, message, data } for success, { success, message } for errors.

const success = (res, statusCode, message, data = null, meta = null) => {
  const body = { success: true, message };
  if (data !== null) body.data = data;
  if (meta !== null) body.meta = meta;
  return res.status(statusCode).json(body);
};

const error = (res, statusCode, message) => {
  return res.status(statusCode).json({ success: false, message });
};

module.exports = { success, error };
