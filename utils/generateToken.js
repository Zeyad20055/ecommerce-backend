// utils/generateToken.js
// Signs a JWT for a given admin id and sets it as an httpOnly cookie
// on the response. Centralizing this keeps login/refresh consistent.

const jwt = require('jsonwebtoken');

const generateToken = (res, adminId) => {
  const token = jwt.sign({ id: adminId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

  const cookieExpiresDays = Number(process.env.JWT_COOKIE_EXPIRES_DAYS) || 7;

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: cookieExpiresDays * 24 * 60 * 60 * 1000,
  });

  return token;
};

module.exports = generateToken;
