const fs = require('fs');

let serverCode = fs.readFileSync('c:\\Users\\Cigiri Krishnasri\\.gemini\\antigravity\\brain\\743c1edf-85cc-45ff-a9fe-e4f6eb3413a3\\online compliant\\backend\\server.js', 'utf8');

// The block to replace: From register-step1 all the way until login
const startStr = "app.post('/api/auth/register-step1',";
const endStr = "app.post('/api/auth/login',";

const startIndex = serverCode.indexOf(startStr);
const endIndex = serverCode.indexOf(endStr);

if (startIndex > -1 && endIndex > -1) {
  const replacement = `app.post('/api/auth/register-step1', async (req, res) => {
  try {
    const { name, phone, email, password, role } = req.body;
    
    // Validate phone number
    if (!/^[6-9]\\d{9}$/.test(phone)) {
      return res.status(400).json({ success: false, error: 'Phone number must be exactly 10 digits and start with 6, 7, 8, or 9' });
    }

    const existingUser = await User.findOne({ $or: [{ phone }, { email }] });
    if (existingUser && existingUser.registrationStatus === 'Success') {
      return res.status(400).json({ success: false, error: 'User already exists with this phone or email' });
    }
    
    const emailOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const phoneOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const roleToSet = (role === 'admin') ? 'admin' : 'user';
    
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
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD }
        });
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

    res.json({ success: true, message: 'OTP sent to your email' });
  } catch (error) { res.status(500).json({ success: false, error: error.message }); }
});

app.post('/api/auth/verify-email-otp', async (req, res) => {
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
});

`;

  const newContent = serverCode.substring(0, startIndex) + replacement + "\n" + serverCode.substring(endIndex);
  fs.writeFileSync('c:\\Users\\Cigiri Krishnasri\\.gemini\\antigravity\\brain\\743c1edf-85cc-45ff-a9fe-e4f6eb3413a3\\online compliant\\backend\\server.js', newContent, 'utf8');
}
