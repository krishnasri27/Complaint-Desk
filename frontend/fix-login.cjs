const fs = require('fs');
const serverPath = 'c:\\Users\\Cigiri Krishnasri\\.gemini\\antigravity\\brain\\743c1edf-85cc-45ff-a9fe-e4f6eb3413a3\\online compliant\\backend\\server.js';
let code = fs.readFileSync(serverPath, 'utf8');

// THE ROOT CAUSE: The single findOne with {$or:[...], password} is wrong.
// Mongoose won't properly AND the password field with $or like this for matching.
// Fix: Find by identifier first, then manually check password.
const oldLogin = `  try {\r
    const { identifier, password, role } = req.body;\r
    const user = await User.findOne({ $or: [{ email: identifier }, { phone: identifier }], password });\r
    if (!user) return res.status(400).json({ success: false, error: 'Invalid credentials' });\r
    if (user.registrationStatus !== 'Success') return res.status(400).json({ success: false, error: 'Account not verified' });\r
    if (role === 'admin' && user.role !== 'admin') return res.status(403).json({ success: false, error: 'Access Denied. Not an admin.' });
    if (role === 'user' && user.role === 'admin') return res.status(403).json({ success: false, error: 'Admin must login using Admin tab.' });\r
    res.json({ success: true, user });\r
  } catch (error) { res.status(500).json({ success: false, error: error.message }); }\r
});`;

const newLogin = `  try {
    const { identifier, password, role } = req.body;
    // Step 1: Find the user by email OR phone only (not password in query)
    const user = await User.findOne({ $or: [{ email: identifier }, { phone: identifier }] });
    console.log('LOGIN DEBUG - identifier:', identifier, '| found user:', user ? user.email : 'null', '| status:', user ? user.registrationStatus : 'N/A');
    if (!user) return res.status(400).json({ success: false, error: 'No account found with this email or phone' });
    // Step 2: Check password separately
    if (user.password !== password) return res.status(400).json({ success: false, error: 'Incorrect password' });
    if (user.registrationStatus !== 'Success') return res.status(400).json({ success: false, error: 'Account not yet verified. Please complete OTP verification.' });
    if (role === 'admin' && user.role !== 'admin') return res.status(403).json({ success: false, error: 'Access Denied. Not an admin.' });
    if (role === 'user' && user.role === 'admin') return res.status(403).json({ success: false, error: 'Admin must login using Admin tab.' });
    res.json({ success: true, user });
  } catch (error) { res.status(500).json({ success: false, error: error.message }); }
});`;

code = code.replace(oldLogin, newLogin);
fs.writeFileSync(serverPath, code, 'utf8');
console.log('Fixed login query - now finds user by identifier first, then checks password separately.');
