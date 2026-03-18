const fs = require('fs');
const filepath = 'c:\\Users\\Cigiri Krishnasri\\.gemini\\antigravity\\brain\\743c1edf-85cc-45ff-a9fe-e4f6eb3413a3\\online compliant\\frontend\\src\\App.jsx';
let code = fs.readFileSync(filepath, 'utf8');

// The most robust way: Array of lines. We find line index, splice it, join it.
let lines = code.split('\n');

// Find where handleRegisterStep1 starts and ends
let hRegStart = -1, hRegEnd = -1;
for(let i = 0; i < lines.length; i++) {
   if (lines[i].includes('const handleRegisterStep1 = async')) hRegStart = i;
   if (hRegStart > -1 && i > hRegStart && lines[i].includes('  };') && lines[i].startsWith('  }')) {
       hRegEnd = i;
       break;
   }
}

// Find where handleVerifyOTP starts and ends
let hVerStart = -1, hVerEnd = -1;
for(let i = 0; i < lines.length; i++) {
   if (lines[i].includes('const handleVerifyOTP = async')) hVerStart = i;
   if (hVerStart > -1 && i > hVerStart && lines[i].includes('  };') && lines[i].startsWith('  }')) {
       hVerEnd = i;
       break;
   }
}

// Find where the next function starts (e.g., handleAudioRecording or handleVerifyEmailOTP if half inserted)
let nextFuncStart = -1;
for(let i = hVerEnd + 1; i < lines.length; i++) {
   if (lines[i].includes('const handleVerifyEmailOTP = async') || lines[i].includes('const handleAudioRecording')) {
       nextFuncStart = i;
       break;
   }
}

const newRegBlock = `  const handleRegisterStep1 = async (e) => {
    e.preventDefault();
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
        navigateTo('registerPending');
      } else { alert(data.error); }
    } catch (err) { console.log(err); alert('Failed to connect to server.'); }
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


if (hRegStart > -1 && nextFuncStart > -1) {
   lines.splice(hRegStart, nextFuncStart - hRegStart, newRegBlock);
}

// Now the UI for registerOTP and registerPending
let otpViewStart = -1, otpViewEnd = -1;
let pendingViewStart = -1, pendingViewEnd = -1;
for(let i = 0; i < lines.length; i++) {
   if (lines[i].includes("{view === 'registerOTP'") || lines[i].includes("── REGISTER STEP 2 (OTP) ──") || lines[i].includes("── OTP VERIFY ──")) {
       if (otpViewStart === -1) otpViewStart = i;
   }
   if (lines[i].includes("── EMAIL PENDING ──") || lines[i].includes("── EMAIL PENDING (NOW EMAIL OTP) ──")) {
       pendingViewStart = i;
       break;
   }
}

// remove registerOTP view
if (otpViewStart > -1 && pendingViewStart > -1 && otpViewStart < pendingViewStart) {
    lines.splice(otpViewStart, pendingViewStart - otpViewStart);
}

// recalculate after splice
let newPendingStart = -1, newPendingEnd = -1;
for(let i = 0; i < lines.length; i++) {
   if (lines[i].includes("{view === 'registerPending'")) newPendingStart = i;
   if (lines[i].includes("── COMPLAINT FORM ──") || lines[i].includes("── DASHBOARD ──")) {
       newPendingEnd = i;
       if (newPendingStart > -1) break;
   }
}

if (newPendingStart > -1 && newPendingEnd > -1) {
    const newPendingView = `{/* ── EMAIL PENDING (NOW EMAIL OTP) ── */}
          {view === 'registerPending' && (
            <motion.div key="reg3" variants={pageVariants} initial="initial" animate="in" exit="out" transition={{ duration: 0.5 }} className="w-full max-w-md mx-auto">
              <div className={\`\${glassCard} text-center\`}>
                {renderModuleHeader("Check Your Email")}
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

              </div>
            </motion.div>
          )}

          `;
    // go backward a few lines from newPendingStart to capture the comment
    let actStart = newPendingStart;
    for(let j=newPendingStart; j>0; j--){
       if (lines[j].includes('── EMAIL PENDING')) { actStart = j; break; }
    }
    
    lines.splice(actStart, newPendingEnd - actStart, newPendingView);
}

fs.writeFileSync(filepath, lines.join('\n'), 'utf8');
console.log("Successfully rebuilt frontend App.jsx utilizing line arrays.");
