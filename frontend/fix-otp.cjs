const fs = require('fs');

// Fix 1: server.js - add detailed debug logging and OTP trim/toString comparison
const serverPath = 'c:\\Users\\Cigiri Krishnasri\\.gemini\\antigravity\\brain\\743c1edf-85cc-45ff-a9fe-e4f6eb3413a3\\online compliant\\backend\\server.js';
let serverCode = fs.readFileSync(serverPath, 'utf8');

// Fix the OTP comparison to trim whitespace and ensure string comparison
const oldCompare = `if (!pendingUser || pendingUser.emailOtp !== emailOtp) {
      return res.status(400).json({ success: false, error: 'Invalid or Expired Email OTP' });
    }`;

const newCompare = `const cleanSubmittedOtp = String(emailOtp || '').trim();
    const cleanStoredOtp = String(pendingUser ? pendingUser.emailOtp || '' : '').trim();
    console.log('--- OTP DEBUG ---');
    console.log('Phone lookup key:', JSON.stringify(phone));
    console.log('pendingUser found:', !!pendingUser);
    console.log('Stored OTP:', cleanStoredOtp);
    console.log('Submitted OTP:', cleanSubmittedOtp);
    console.log('Match:', cleanStoredOtp === cleanSubmittedOtp);
    console.log('-----------------');
    if (!pendingUser || cleanStoredOtp !== cleanSubmittedOtp) {
      return res.status(400).json({ success: false, error: 'Invalid or Expired Email OTP' });
    }`;

serverCode = serverCode.replace(oldCompare, newCompare);

// Fix the phone lookup - also trim the phone 
const oldLookup = `const { phone, emailOtp } = req.body;
    global.pendingUsers = global.pendingUsers || {};
    const pendingUser = global.pendingUsers[phone];`;

const newLookup = `const phone = String(req.body.phone || '').trim();
    const emailOtp = req.body.emailOtp;
    global.pendingUsers = global.pendingUsers || {};
    const pendingUser = global.pendingUsers[phone];
    console.log('Available pending user keys:', Object.keys(global.pendingUsers));`;

serverCode = serverCode.replace(oldLookup, newLookup);

fs.writeFileSync(serverPath, serverCode, 'utf8');
console.log('Fixed server.js OTP comparison');

// Fix 2: App.jsx - ensure formData.phone is trimmed before sending
const appPath = 'c:\\Users\\Cigiri Krishnasri\\.gemini\\antigravity\\brain\\743c1edf-85cc-45ff-a9fe-e4f6eb3413a3\\online compliant\\frontend\\src\\App.jsx';
let appCode = fs.readFileSync(appPath, 'utf8');

// Fix the verify function to trim and debug
const oldVerify = `    body: JSON.stringify({ phone: formData.phone, emailOtp: formData.emailOtp })`;
const newVerify = `    body: JSON.stringify({ phone: (formData.phone || '').trim(), emailOtp: (formData.emailOtp || '').trim() })`;

appCode = appCode.replace(oldVerify, newVerify);

// After registration, navigate to pending and keep a COPY of phone in a separate state
// Also fix: after successful OTP verify, navigate to complaintForm, not login
const oldSuccess = `        alert(data.message);
        navigateTo('login'); // user must login after verification`;
const newSuccess = `        alert(data.message);
        if (data.user && data.user.role === 'admin') {
          fetchComplaints();
          navigateTo('adminDashboard');
        } else {
          navigateTo('complaintForm');
        }`;

appCode = appCode.replace(oldSuccess, newSuccess);

fs.writeFileSync(appPath, appCode, 'utf8');
console.log('Fixed App.jsx OTP submission and post-verify navigation');
