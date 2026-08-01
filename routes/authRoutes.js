const express = require("express");
const router = express.Router();

const {
    login,
    logout,
    getMe,
    createAdmin,
} = require("../controllers/authController");

const { loginValidation } = require("../validations/authValidation");
const validate = require("../middleware/validate");
const protect = require("../middleware/auth");

router.post("/login", loginValidation, validate, login);

// هذا السطر يجب أن يكون موجودًا
router.post("/create-admin", createAdmin);

router.post("/logout", protect, logout);
router.get("/me", protect, getMe);

module.exports = router;