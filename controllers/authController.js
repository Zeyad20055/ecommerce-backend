// controllers/authController.js
// Handles admin login/logout, create admin, and returning the logged-in admin's profile.

const Admin = require("../models/Admin");
const generateToken = require("../utils/generateToken");
const { success, error } = require("../utils/apiResponse");

// @desc    Login admin & set JWT cookie
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email }).select("+password");

    if (!admin) {
      return error(res, 401, "Invalid email or password");
    }

    const isMatch = await admin.comparePassword(password);

    if (!isMatch) {
      return error(res, 401, "Invalid email or password");
    }

    const token = generateToken(res, admin._id);

    return success(res, 200, "Login successful", {
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
      token,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new Admin
// @route   POST /api/auth/create-admin
// @access  Public
const createAdmin = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    const exists = await Admin.findOne({ email });

    if (exists) {
      return error(res, 400, "Admin already exists");
    }

    const admin = await Admin.create({
      name,
      email,
      password,
      role: role || "admin",
    });

    return success(res, 201, "Admin created successfully", {
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Logout admin & clear cookie
// @route   POST /api/auth/logout
// @access  Private
const logout = async (req, res, next) => {
  try {
    res.cookie("token", "", {
      httpOnly: true,
      expires: new Date(0),
    });

    return success(res, 200, "Logout successful");
  } catch (err) {
    next(err);
  }
};

// @desc    Get currently logged-in admin's profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    return success(res, 200, "Profile fetched", {
      id: req.admin._id,
      name: req.admin.name,
      email: req.admin.email,
      role: req.admin.role,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  login,
  createAdmin,
  logout,
  getMe,
};