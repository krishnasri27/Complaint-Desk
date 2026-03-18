const fs = require('fs');

// --- UPDATE BACKEND ---
let serverCode = fs.readFileSync('c:\\Users\\Cigiri Krishnasri\\.gemini\\antigravity\\brain\\743c1edf-85cc-45ff-a9fe-e4f6eb3413a3\\online compliant\\backend\\server.js', 'utf8');

const s1 = `async function sendVerificationEmail(toEmail, userName, verifyLink) {`;
const s2 = `app.get('/api/auth/verify-email', async (req, res) => {`;
const endIdx = serverCode.indexOf(s2);
if (endIdx > -1) {
  const replacePart = serverCode.substring(serverCode.indexOf(s1), endIdx);

  const newVerifyEmailCode = `async function sendVerificationEmailOTP(toEmail, userName, emailOtp) {
  const transporter = createTransporter();
  const mailOptions = {
    from: '"Complaint Desk" <' + process.env.GMAIL_USER + '>',
    to: toEmail,
    subject: 'Complete your Registration - Final Email OTP',
    html: \`
      <!DOCTYPE html>
      <html>
      <body style="margin:0;padding:40px;background:#f0f4ff;font-family:Arial,sans-serif;text-align:center;">
        <div style="background:#ffffff;border-radius:20px;padding:40px;max-width:600px;margin:auto;box-shadow:0 8px 30px rgba(0,0,0,0.1);">
          <h2 style="color:#1e293b;font-size:22px;">Hello, \${userName}! 👋</h2>
          <p style="color:#64748b;font-size:16px;">Here is your final email verification OTP to activate your account:</p>
          <div style="margin:30px 0;padding:20px;background:#f8fafc;border-radius:15px;">
             <strong style="font-size:40px;letter-spacing:10px;color:#2563eb;">\${emailOtp}</strong>
          </div>
          <p style="color:#94a3b8;font-size:14px;">Enter this code on the verification screen.</p>
        </div>
      </body>
      </html>
    \`
  };
  await transporter.sendMail(mailOptions);
  console.log('Final Verification OTP email sent to: ' + toEmail);
}

app.post('/api/auth/verify-otp', async (req, res) => {
  try {
    const { phone, otp } = req.body;
    
    global.pendingUsers = global.pendingUsers || {};
    const pendingUser = global.pendingUsers[phone];
    
    if (!pendingUser || pendingUser.otp !== otp) {
      return res.status(400).json({ success: false, error: 'Invalid or Expired Phone OTP' });
    }

    // Now it's valid, let's create the account
    const emailOtp = Math.floor(100000 + Math.random() * 900000).toString();
    
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
    user.verificationToken = emailOtp;
    await user.save();
    
    delete global.pendingUsers[phone];

    if (process.env.GMAIL_USER && process.env.GMAIL_USER !== 'your_gmail@gmail.com') {
      try {
        await sendVerificationEmailOTP(user.email, user.name, emailOtp);
        res.json({ success: true, message: 'OTP Verified. Final Email OTP sent to ' + user.email });
      } catch (mailErr) {
        console.error('Email send failed:', mailErr.message);
        res.json({ success: true, message: 'OTP Verified. Email could not be sent (check Gmail config). OTP is: ' + emailOtp, devLink: emailOtp });
      }
    } else {
      console.log('Gmail not configured, returning dev link.');
      res.json({ success: true, message: 'OTP Verified (dev mode)', devLink: emailOtp });
    }
  } catch (error) { res.status(500).json({ success: false, error: error.message }); }
});

app.post('/api/auth/verify-email-otp', async (req, res) => {
  try {
    const { phone, emailOtp } = req.body;
    const user = await User.findOne({ phone, verificationToken: emailOtp, isPhoneVerified: true });
    if (!user) return res.status(400).json({ success: false, error: 'Invalid or Expired Email OTP' });
    
    user.isEmailVerified = true; 
    user.registrationStatus = 'Success'; 
    user.verificationToken = null; 
    user.otp = null;
    await user.save();
    res.json({ success: true, message: 'Account verified successfully!' });
  } catch (error) { res.status(500).json({ success: false, error: error.message }); }
});

`;
  serverCode = serverCode.replace(replacePart, newVerifyEmailCode);
  
  // also delete the old GET /api/auth/verify-email entirely
  const getVerifyEmailOld = `app.get('/api/auth/verify-email', async (req, res) => {
  try {
    const { token, phone } = req.query;
    const user = await User.findOne({ phone, verificationToken: token, isPhoneVerified: true });
    if (!user) return res.status(400).send('Invalid Link');
    
    user.isEmailVerified = true; user.registrationStatus = 'Success'; user.verificationToken = null; user.otp = null;
    await user.save();
    res.redirect('http://localhost:5173/login');
  } catch (error) { res.status(500).send('Error'); }
});`;
  serverCode = serverCode.replace(getVerifyEmailOld, '');
  fs.writeFileSync('c:\\Users\\Cigiri Krishnasri\\.gemini\\antigravity\\brain\\743c1edf-85cc-45ff-a9fe-e4f6eb3413a3\\online compliant\\backend\\server.js', serverCode, 'utf8');
}


// --- UPDATE FRONTEND ---
let appCode = fs.readFileSync('c:\\Users\\Cigiri Krishnasri\\.gemini\\antigravity\\brain\\743c1edf-85cc-45ff-a9fe-e4f6eb3413a3\\online compliant\\frontend\\src\\App.jsx', 'utf8');

// 1. App.jsx - Add handleVerifyEmailOTP after handleVerifyOTP
const verOtpTarget = `} catch (err) { navigateTo('registerPending'); }
  };`;
const verEmailOtpInsert = `} catch (err) { navigateTo('registerPending'); }
  };

  const handleVerifyEmailOTP = async (e) => {
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
  };`;
appCode = appCode.replace(verOtpTarget, verEmailOtpInsert);

// 2. App.jsx - Rewrite registerPending UI
const pendingUITargetStart = `{/* ── EMAIL PENDING ── */}`;
const pendingUITargetEnd = `{/* ── ADMIN DASHBOARD ── */}`;

const fullOldPendingUi = appCode.substring(appCode.indexOf(pendingUITargetStart), appCode.indexOf(pendingUITargetEnd));

const newPendingUi = `{/* ── EMAIL PENDING (NOW EMAIL OTP) ── */}
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
                  <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-4 rounded-[30px] shadow-lg transition-all text-xl">Verify Email OTP</button>
                </form>

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

appCode = appCode.replace(fullOldPendingUi, newPendingUi);
fs.writeFileSync('c:\\Users\\Cigiri Krishnasri\\.gemini\\antigravity\\brain\\743c1edf-85cc-45ff-a9fe-e4f6eb3413a3\\online compliant\\frontend\\src\\App.jsx', appCode, 'utf8');
console.log("Updated both apps");
