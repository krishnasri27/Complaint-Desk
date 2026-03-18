const fs = require('fs');
const serverPath = 'c:\\Users\\Cigiri Krishnasri\\.gemini\\antigravity\\brain\\743c1edf-85cc-45ff-a9fe-e4f6eb3413a3\\online compliant\\backend\\server.js';
let code = fs.readFileSync(serverPath, 'utf8');

// Fix the response of verify-email-otp to include the user object
const oldVerifyRes = `    delete global.pendingUsers[phone];
    res.json({ success: true, message: 'Account verified successfully!' });`;

const newVerifyRes = `    delete global.pendingUsers[phone];
    res.json({ success: true, message: 'Account verified successfully!', user });`;

code = code.replace(oldVerifyRes, newVerifyRes);

fs.writeFileSync(serverPath, code, 'utf8');
console.log('Fixed server.js: verify-email-otp now returns user object.');
