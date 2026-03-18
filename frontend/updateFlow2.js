const fs = require('fs');

// --- UPDATE BACKEND ---
let serverCode = fs.readFileSync('c:\\Users\\Cigiri Krishnasri\\.gemini\\antigravity\\brain\\743c1edf-85cc-45ff-a9fe-e4f6eb3413a3\\online compliant\\backend\\server.js', 'utf8');

const regStep1Start = `app.post('/api/auth/register-step1', async (req, res) => {`;
const regStep1End = `res.json({ success: true, message: 'OTP sent to your email', devOtp: otp });
  } catch (error) { res.status(500).json({ success: false, error: error.message }); }
});`;

const verifyOtpStart = `app.post('/api/auth/verify-otp', async (req, res) => {`;
const verifyOtpEnd = `} catch (error) { res.status(500).json({ success: false, error: error.message }); }
});`;

const verifyEmailOtpEnd = `res.json({ success: true, message: 'Account verified successfully!' });
  } catch (error) { res.status(500).json({ success: false, error: error.message }); }
});`;


if (serverCode.includes(regStep1Start) && serverCode.includes(regStep1End)) {
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
      const roleToSet = (role === 'admin') ? 'admin' : 'user';
      
      // Store in global memory instead of Database
      global.pendingUsers = global.pendingUsers || {};
      global.pendingUsers[phone] = {
        name, phone, email, password, role: roleToSet, emailOtp, createdAt: Date.now()
      };
      
      console.log('--- SMS SIMULATION ---');
      console.log('Sending SMS to: ' + phone);
      console.log('Message: Your Complaint Desk Verification Link has been sent to your email.');
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
          return res.status(500).json({ success: false, error: 'Failed to send OTP to email. Please configure valid Gmail credentials.' });
        }
      } else {
         console.log('OTP Email generated (no email config):', emailOtp);
      }

      res.json({ success: true, message: 'OTP sent to your email' }); 
    } catch (error) { res.status(500).json({ success: false, error: error.message }); }
  });`;

  let middlePart = '';
  if (serverCode.includes(verifyOtpStart)) {
    middlePart = serverCode.substring(serverCode.indexOf(regStep1End) + regStep1End.length, serverCode.indexOf(verifyOtpStart));
  } else {
     middlePart = serverCode.substring(serverCode.indexOf(regStep1End) + regStep1End.length);
  }

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

  let afterPart = '';
  if (serverCode.includes(verifyEmailOtpEnd)) {
     afterPart = serverCode.substring(serverCode.indexOf(verifyEmailOtpEnd) + verifyEmailOtpEnd.length);
  } else if (serverCode.includes(verifyOtpEnd)) {
     afterPart = serverCode.substring(serverCode.indexOf(verifyOtpEnd) + verifyOtpEnd.length);
  } else {
    // If we can't find the end markers, it's safer to just append the remaining text from the middle logic.
    afterPart = "";
  }
  
  // Cleanup old verification code if it's there
  if(middlePart.includes("app.post('/api/auth/verify-email-otp'")) {
      const start = middlePart.indexOf("app.post('/api/auth/verify-email-otp'");
      middlePart = middlePart.substring(0, start);
  }


  fs.writeFileSync('c:\\Users\\Cigiri Krishnasri\\.gemini\\antigravity\\brain\\743c1edf-85cc-45ff-a9fe-e4f6eb3413a3\\online compliant\\backend\\server.js', newServerCode + newRegStep1 + middlePart + newVerifyEmailOtp + afterPart, 'utf8');
}


// --- UPDATE FRONTEND ---
let appCode = fs.readFileSync('c:\\Users\\Cigiri Krishnasri\\.gemini\\antigravity\\brain\\743c1edf-85cc-45ff-a9fe-e4f6eb3413a3\\online compliant\\frontend\\src\\App.jsx', 'utf8');

// Update handleRegisterStep1 in frontend
const regStep1StartFn = `  const handleRegisterStep1 = async (e) => {`;
const regStep1EndFn = `} catch (err) { console.log(err); navigateTo('registerOTP'); }
  };`;

if (appCode.includes(regStep1StartFn) && appCode.includes(regStep1EndFn)) {
  const newRegStep1Fn = `  const handleRegisterStep1 = async (e) => {
      e.preventDefault();
      // Validate phone number
      if (!/^[6-9]\\d{9}$/.test(formData.phone)) {
        alert("Phone number must be exactly 10 digits and start with 6, 7, 8, or 9.");
        return;
      }
      try {
        const res = await fetch('http://localhost:5000/api/auth/register-step1', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: formData.name, phone: formData.phone, email: formData.email, password: formData.password, role: formData.role })
        });
        const data = await res.json();
        if (data.success) {
          alert('OTP sent to your email. Check your inbox to complete verification.');
          navigateTo('registerPending'); // Skip directly to email OTP UI
        } else { alert(data.error); }
      } catch (err) { console.log(err); alert('Failed to connect to server.'); }
    };`;

  const part1Fn = appCode.substring(0, appCode.indexOf(regStep1StartFn));
  const part2Fn = appCode.substring(appCode.indexOf(regStep1EndFn) + regStep1EndFn.length);
  appCode = part1Fn + newRegStep1Fn + part2Fn;
}

// 1. App.jsx - Add handleVerifyEmailOTP after handleVerifyOTP (or handleRegisterStep1)
if (!appCode.includes('handleVerifyEmailOTP')) {
  const insertTarget = "const handleAudioRecording";
  const newFunc = `const handleVerifyEmailOTP = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/auth/verify-email-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: formData.phone, emailOtp: formData.emailOtp })
      });
      const data = await res.json();
      if (data.success) {
        alert(data.message);
        navigateTo('login');
      } else { alert(data.error); }
    } catch (err) { alert('Error verifying email OTP'); }
  };

  const handleAudioRecording`;
  
  appCode = appCode.replace(insertTarget, newFunc);
}

// 2. App.jsx - Rewrite registerPending UI
const viewTarget = "{/* ── EMAIL PENDING ── */}";
const viewEndTarget = "{/* ── COMPLAINT FORM ── */}";

const oldViewStart = appCode.indexOf(viewTarget);
let oldViewEnd = appCode.indexOf(viewEndTarget);

if (oldViewStart > -1) {
    if(oldViewEnd === -1) {
        oldViewEnd = appCode.indexOf("{/* ── DASHBOARD ── */}");
    }
  if (oldViewEnd > -1) {
    const newView = `{/* ── EMAIL PENDING (NOW EMAIL OTP) ── */}
            {view === 'registerPending' && (
              <motion.div key="reg3" variants={pageVariants} initial="initial" animate="in" exit="out" transition={{ duration: 0.5 }} className="w-full max-w-md mx-auto">
                <div className={\`\${glassCard} text-center\`}>
                  {renderModuleHeader(ct.checkEmail)}
                  <div className="w-24 h-24 bg-blue-100/80 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner border-4 border-white">
                    <HiShieldCheck className="w-12 h-12 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-black text-slate-800 mb-2">Final Email Verification</h2>
                  <p className="text-slate-600 font-medium mb-6">
                    An Email OTP has been sent to <strong>{formData.email}</strong>. Enter the 6-digit Email OTP below.
                  </p>
  
                  <form onSubmit={handleVerifyEmailOTP}>
                    <input required type="text" maxLength="6" value={formData.emailOtp || ''} onChange={e => setFormData({ ...formData, emailOtp: e.target.value })} className="w-full text-center tracking-[0.5em] px-6 py-6 text-4xl font-black rounded-[25px] border-2 border-white/80 bg-white/70 focus:bg-white focus:border-blue-500 outline-none shadow-inner mb-6 text-slate-800" placeholder="••••••" />
                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-4 rounded-[30px] shadow-lg transition-all text-xl">Verify Account</button>
                  </form>
  
                  {/* Dev fallback — Gmail not configured yet */}
                  {formData.devVerifyLink && (
                    <div className="mt-6 text-left bg-amber-50 border border-amber-200 rounded-2xl p-4">
                      <p className="text-sm font-bold text-amber-700 mb-2">⚠ Dev Mode (Gmail not configured)</p>
                      <p className="text-xs break-words">Your Email OTP is: {formData.devVerifyLink}</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
  
            `;
    const toReplace = appCode.substring(oldViewStart, oldViewEnd);
    appCode = appCode.replace(toReplace, newView);
  }
}

// Remove registerOTP view entirely
const otpViewStart = `{/* ── REGISTER STEP 2 (OTP) ── */}`;
const pendingViewStart = `{/* ── EMAIL PENDING (NOW EMAIL OTP) ── */}`;
if (appCode.indexOf(otpViewStart) > -1 && appCode.indexOf(pendingViewStart) > -1) {
  const view1 = appCode.substring(0, appCode.indexOf(otpViewStart));
  const view2 = appCode.substring(appCode.indexOf(pendingViewStart));
  appCode = view1 + view2;
}


fs.writeFileSync('c:\\Users\\Cigiri Krishnasri\\.gemini\\antigravity\\brain\\743c1edf-85cc-45ff-a9fe-e4f6eb3413a3\\online compliant\\frontend\\src\\App.jsx', appCode, 'utf8');
console.log("Updated both apps!");
