const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'server.js');
let code = fs.readFileSync(filePath, 'utf8');

const regStep1Start = code.indexOf("app.post('/api/auth/register-step1'");
const regStep1End = code.indexOf("// Nodemailer transporter");

if (regStep1Start !== -1 && regStep1End !== -1) {
  const newRegStep1 = `app.post('/api/auth/register-step1', async (req, res) => {
  try {
    const { name, phone, email, password, role } = req.body;
    
    // Do NOT create account yet. Check if exists.
    const existingUser = await User.findOne({ $or: [{ phone }, { email }] });
    if (existingUser && existingUser.registrationStatus === 'Success') {
      return res.status(400).json({ success: false, error: 'User already exists with this phone or email' });
    }
    
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const roleToSet = (role === 'admin') ? 'admin' : 'user';
    
    // Store in global memory instead of Database
    global.pendingUsers = global.pendingUsers || {};
    global.pendingUsers[phone] = {
      name, phone, email, password, role: roleToSet, otp, createdAt: Date.now()
    };
    
    if (process.env.GMAIL_USER && process.env.GMAIL_USER !== 'your_gmail@gmail.com') {
      try {
        const transporter = createTransporter();
        const mailOptions = {
          from: '"Complaint Desk" <' + process.env.GMAIL_USER + '>',
          to: email,
          subject: 'Your Account Verification OTP',
          html: '<div style="font-family: Arial, sans-serif; padding: 20px;"><h2>Welcome to Complaint Desk</h2><p>Your 6-digit verification code is: <strong style="font-size: 24px; color: #1e40af;">' + otp + '</strong></p><p>Please enter this code on the registration page to verify your account.</p></div>'
        };
        await transporter.sendMail(mailOptions);
        console.log('OTP Email sent to: ' + email);
      } catch (err) {
        console.error('Failed to send OTP email:', err.message);
        return res.status(500).json({ success: false, error: 'Failed to send OTP to email.' });
      }
    } else {
       console.log('OTP generated (no email config):', otp);
    }

    res.json({ success: true, message: 'OTP sent to your email', devOtp: otp });
  } catch (error) { res.status(500).json({ success: false, error: error.message }); }
});

`;

  const before = code.substring(0, regStep1Start);
  const after = code.substring(regStep1End);
  
  let newCode = before + newRegStep1 + after;
  
  const verifyStart = newCode.indexOf("app.post('/api/auth/verify-otp'");
  const verifyEnd = newCode.indexOf("app.get('/api/auth/verify-email'");
  
  if (verifyStart !== -1 && verifyEnd !== -1) {
      const newVerify = `app.post('/api/auth/verify-otp', async (req, res) => {
  try {
    const { phone, otp } = req.body;
    
    global.pendingUsers = global.pendingUsers || {};
    const pendingUser = global.pendingUsers[phone];
    
    if (!pendingUser || pendingUser.otp !== otp) {
      return res.status(400).json({ success: false, error: 'Invalid or Expired OTP' });
    }

    // Now it's valid, let's create the account
    const vToken = crypto.randomBytes(32).toString('hex');
    
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

    user.isPhoneVerified = true;
    user.isEmailVerified = false;
    user.registrationStatus = 'Pending';
    user.verificationToken = vToken;
    await user.save();
    
    delete global.pendingUsers[phone];

    const verifyLink = 'http://localhost:5000/api/auth/verify-email?token=' + vToken + '&phone=' + phone;
    console.log('Verification link: ' + verifyLink);

    if (process.env.GMAIL_USER && process.env.GMAIL_USER !== 'your_gmail@gmail.com') {
      try {
        await sendVerificationEmail(user.email, user.name, verifyLink);
        res.json({ success: true, message: 'OTP Verified. Verification email sent to ' + user.email });
      } catch (mailErr) {
        console.error('Email send failed:', mailErr.message);
        res.json({ success: true, message: 'OTP Verified. Email could not be sent (check Gmail config). Link: ' + verifyLink, devLink: verifyLink });
      }
    } else {
      console.log('Gmail not configured, returning dev link.');
      res.json({ success: true, message: 'OTP Verified (dev mode)', devLink: verifyLink });
    }
  } catch (error) { res.status(500).json({ success: false, error: error.message }); }
});

`;
      const beforeV = newCode.substring(0, verifyStart);
      const afterV = newCode.substring(verifyEnd);
      
      newCode = beforeV + newVerify + afterV;
      fs.writeFileSync(filePath, newCode, 'utf8');
      console.log("Replacement successful");
  } else {
      console.log("Could not find verify-otp");
  }

} else {
  console.log("Could not find register-step1");
}

