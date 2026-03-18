const express = require("express");
const router = express.Router();
const { sendOTP, verifyOTP, validateUniqueness } = require("../controllers/otpController");

// Route to send OTP
router.post("/send-otp", validateUniqueness, sendOTP);

// Route to verify OTP
router.post("/verify-otp", verifyOTP);

module.exports = router;
