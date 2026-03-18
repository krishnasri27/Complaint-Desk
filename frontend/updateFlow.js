const fs = require('fs');

// --- UPDATE BACKEND ---
let serverCode = fs.readFileSync('c:\\Users\\Cigiri Krishnasri\\.gemini\\antigravity\\brain\\743c1edf-85cc-45ff-a9fe-e4f6eb3413a3\\online compliant\\backend\\server.js', 'utf8');

const regStep1Start = `app.post('/api/auth/register-step1', async (req, res) => {`;
const regStep1End = `res.json({ success: true, message: 'OTP sent to your email', devOtp: otp });
  } catch (error) { res.status(500).json({ success: false, error: error.message }); }
});`;

const verifyOtpStart = `app.post('/api/auth/verify-otp', async (req, res) => {`;
const verifyEmailOtpEnd = `res.json({ success: true, message: 'Account verified successfully!' });
  } catch (error) { res.status(500).json({ success: false, error: error.message }); }
});`;

let newServerCode = serverCode.substring(0, serverCode.indexOf(regStep1Start));

// New Register Step 1
const newRegStep1 = `app.post('/api/auth/register-step1', async (req, res) => {
  try {
    const { name, phone, email, password, role } = req.body;
    
    // Validate phone number
    if (!/^[6-9]\\d{9}$/.test(phone)) {
      return res.status(400).json({ success: false, error: 'Phone number must be exactly 10 digits and start with 6, 7, 8, or 9' });
    }

    // Do NOT create account yet. Check if exists.
    const existingUser = await User.findOne({ $or: [{ phone }, { email }] });
    if (existingUser && existingUser.registrationStatus === 'Success') {
      return res.status(400).json({ success: false, error: 'User already exists with this phone or email' });
    }
    
    const emailOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const phoneOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const roleToSet = (role === 'admin') ? 'admin' : 'user';
    
    // Store in global memory instead of Database
    global.pendingUsers = global.pendingUsers || {};
    global.pendingUsers[phone] = {
      name, phone, email, password, role: roleToSet, emailOtp, phoneOtp, createdAt: Date.now()
    };
    
    console.log('--- SMS SIMULATION ---');
    console.log('Sending SMS to: ' + phone);
    console.log('Message: Your Complaint Desk OTP is: ' + phoneOtp);
    console.log('----------------------');

    if (process.env.GMAIL_USER && process.env.GMAIL_USER !== 'your_gmail@gmail.com') {
      try {
        const transporter = createTransporter();
        const mailOptions = {
          from: '"Complaint Desk" <' + process.env.GMAIL_USER + '>',
          to: email,
          subject: 'Your Account Verification OTP',
          html: \`<div style="font-family: Arial, sans-serif; padding: 20px;"><h2>Welcome to Complaint Desk</h2><p>Your 6-digit Email verification code is: <strong style="font-size: 24px; color: #1e40af;">\${emailOtp}</strong></p><p>Please enter this code on the registration page to verify your account.</p></div>\`
        };
        await transporter.sendMail(mailOptions);
        console.log('OTP Email sent to: ' + email);
      } catch (err) {
        console.error('Failed to send OTP email:', err.message);
        return res.status(500).json({ success: false, error: 'Failed to send OTP to email.' });
      }
    } else {
       console.log('OTP Email generated (no email config):', emailOtp);
    }

    res.json({ success: true, message: 'OTP sent to your email' }); // Do NOT send devOtp
  } catch (error) { res.status(500).json({ success: false, error: error.message }); }
});`;

const middlePart = serverCode.substring(serverCode.indexOf(regStep1End) + regStep1End.length, serverCode.indexOf(verifyOtpStart));

// New Verify Email OTP (skipping phone OTP completely per new instructions)
const newVerifyEmailOtp = `app.post('/api/auth/verify-email-otp', async (req, res) => {
  try {
    const { phone, emailOtp } = req.body;
    global.pendingUsers = global.pendingUsers || {};
    const pendingUser = global.pendingUsers[phone];

    if (!pendingUser || pendingUser.emailOtp !== emailOtp) {
      return res.status(400).json({ success: false, error: 'Invalid or Expired Email OTP' });
    }

    let user = await User.findOne({ phone });
    if (!user) {
      user = new User({
        name: pendingUser.name,
        phone: pendingUser.phone,
        email: pendingUser.email,
        password: pendingUser.password,
        role: pendingUser.role
      });
    }
    
    user.isEmailVerified = true; 
    user.isPhoneVerified = true; 
    user.registrationStatus = 'Success'; 
    user.verificationToken = null; 
    user.otp = null;
    await user.save();
    
    delete global.pendingUsers[phone];
    res.json({ success: true, message: 'Account verified successfully!' });
  } catch (error) { res.status(500).json({ success: false, error: error.message }); }
});`;

const afterPart = serverCode.substring(serverCode.indexOf(verifyEmailOtpEnd) + verifyEmailOtpEnd.length);

fs.writeFileSync('c:\\Users\\Cigiri Krishnasri\\.gemini\\antigravity\\brain\\743c1edf-85cc-45ff-a9fe-e4f6eb3413a3\\online compliant\\backend\\server.js', newServerCode + newRegStep1 + middlePart + newVerifyEmailOtp + afterPart, 'utf8');


// --- UPDATE FRONTEND ---
let appCode = fs.readFileSync('c:\\Users\\Cigiri Krishnasri\\.gemini\\antigravity\\brain\\743c1edf-85cc-45ff-a9fe-e4f6eb3413a3\\online compliant\\frontend\\src\\App.jsx', 'utf8');

// Update handleRegisterStep1 in frontend
const regStep1StartFn = `  const handleRegisterStep1 = async (e) => {`;
const regStep1EndFn = `} catch (err) { console.log(err); navigateTo('registerOTP'); }
  };`;

const newRegStep1Fn = `  const handleRegisterStep1 = async (e) => {
    e.preventDefault();
    if (!/^[6-9]\\d{9}$/.test(formData.phone)) {
      alert("Phone number must be exactly 10 digits and start with 6, 7, 8, or 9.");
      return;
    }
    try {
      const res = await fetch('http://localhost:5000/api/auth/register-step1', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: formData.phone, phone: formData.phone, email: formData.email, password: formData.password, role: formData.role }) // use standard name
      });
      const data = await res.json();
      if (data.success) {
        alert('OTP sent to your email.');
        navigateTo('registerPending'); // Skip directly to email OTP
      } else { alert(data.error); }
    } catch (err) { console.log(err); navigateTo('registerPending'); }
  };`;

// replace we need to handle the whole block
const part1Fn = appCode.substring(0, appCode.indexOf(regStep1StartFn));
const part2Fn = appCode.substring(appCode.indexOf(regStep1EndFn) + regStep1EndFn.length);
appCode = part1Fn + newRegStep1Fn + part2Fn;

// Replace formData.name in registering fetch since I mistakenly mapped it to formData.phone above
appCode = appCode.replace(/name: formData\.phone, phone: formData\.phone/g, 'name: formData.name, phone: formData.phone');

// Remove registerOTP view entirely
const otpViewStart = `{/* ── REGISTER STEP 2 (OTP) ── */}`;
const pendingViewStart = `{/* ── EMAIL PENDING (NOW EMAIL OTP) ── */}`;
if (appCode.indexOf(otpViewStart) > -1 && appCode.indexOf(pendingViewStart) > -1) {
  const view1 = appCode.substring(0, appCode.indexOf(otpViewStart));
  const view2 = appCode.substring(appCode.indexOf(pendingViewStart));
  appCode = view1 + view2;
}

fs.writeFileSync('c:\\Users\\Cigiri Krishnasri\\.gemini\\antigravity\\brain\\743c1edf-85cc-45ff-a9fe-e4f6eb3413a3\\online compliant\\frontend\\src\\App.jsx', appCode, 'utf8');
console.log("Updated flow!");
