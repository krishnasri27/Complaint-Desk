const nodemailer = require("nodemailer");
const User = require("../models/User");

// OTP Store
let otpStore = {};

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER || "yourgmail@gmail.com",
    pass: process.env.GMAIL_APP_PASSWORD || "your_app_password",
  },
});

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

const sendOTP = async (req, res) => {
  const { email } = req.body;

  // Validate Email
  if (!email || email.includes(" ") || !email.endsWith("@gmail.com")) {
    return res.status(400).json({
      error: "Please enter a valid Gmail address (example: yourname@gmail.com)",
    });
  }

  const otp = generateOTP();
  otpStore[email] = {
    otp: otp,
    expiry: Date.now() + 5 * 60 * 1000, // 5 minutes
  };

  const mailOptions = {
    from: process.env.GMAIL_USER || "yourgmail@gmail.com",
    to: email,
    subject: "Account Verification OTP",
    text: `Hello,\n\nYour OTP code is: ${otp}\n\nThis code will expire in 5 minutes.\n\nDo not share this code with anyone.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ error: "Failed to send OTP" });
  }
};

const verifyOTP = (req, res) => {
  const { email, otp } = req.body;

  if (!otpStore[email]) {
    return res.status(400).json({ error: "Invalid OTP" });
  }

  const storedData = otpStore[email];

  if (Date.now() > storedData.expiry) {
    delete otpStore[email];
    return res.status(400).json({ error: "OTP expired. Request new OTP." });
  }

  if (storedData.otp === otp) {
    delete otpStore[email];
    return res.status(200).json({ message: "OTP Verified" });
  } else {
    return res.status(400).json({ error: "Invalid OTP" });
  }
};

// Requirement 8: Ensure Email and Phone Uniqueness
const validateUniqueness = async (req, res, next) => {
  const { email, phone } = req.body;

  try {
    if (phone) {
      // Phone Number Rules: 10 digits, numbers only
      const phoneRegex = /^[0-9]{10}$/;
      if (!phoneRegex.test(phone)) {
        return res.status(400).json({ error: "Phone number must contain exactly 10 digits" });
      }

      const existingPhone = await User.findOne({ phone });
      if (existingPhone) {
        return res.status(400).json({ error: "Phone number already registered" });
      }
    }

    if (email) {
      // Email Rules: Gmail format, no spaces
      if (email.includes(" ") || !email.endsWith("@gmail.com")) {
        return res.status(400).json({ error: "Please enter a valid Gmail address (example: yourname@gmail.com)" });
      }

      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
        return res.status(400).json({ error: "Email already registered" });
      }
    }

    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  sendOTP,
  verifyOTP,
  validateUniqueness,
};
