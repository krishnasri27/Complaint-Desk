const express = require("express");
const router = express.Router();

// Temporary users array (for testing without database)
let users = [];

/* =========================
   REGISTER API
   POST /api/auth/register
========================= */

router.post("/register", (req, res) => {

  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      message: "Please enter all fields"
    });
  }

  // check if user already exists
  const userExists = users.find(user => user.email === email);

  if (userExists) {
    return res.status(400).json({
      message: "User already exists"
    });
  }

  const newUser = {
    id: users.length + 1,
    name,
    email,
    password
  };

  users.push(newUser);

  res.status(201).json({
    message: "User registered successfully",
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email
    }
  });

});


/* =========================
   LOGIN API
   POST /api/auth/login
========================= */

router.post("/login", (req, res) => {

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Please enter email and password"
    });
  }

  const user = users.find(user => user.email === email);

  if (!user) {
    return res.status(401).json({
      message: "User not found"
    });
  }

  if (user.password !== password) {
    return res.status(401).json({
      message: "Invalid password"
    });
  }

  res.json({
    message: "Login successful",
    user: {
      id: user.id,
      name: user.name,
      email: user.email
    }
  });

});

module.exports = router;