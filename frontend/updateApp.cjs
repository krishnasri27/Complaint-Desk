const fs = require('fs');

const appPath = 'c:\\Users\\Cigiri Krishnasri\\.gemini\\antigravity\\brain\\743c1edf-85cc-45ff-a9fe-e4f6eb3413a3\\online compliant\\frontend\\src\\App.jsx';
let appCode = fs.readFileSync(appPath, 'utf8');

// 1. Insert handleVerifyEmailOTP
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
  console.log('Inserted handleVerifyEmailOTP');
}

// 2. Replace registerPending UI
const viewTarget = "{/* ── EMAIL PENDING ── */}";
const viewEndTarget = "{/* ── COMPLAINT FORM ── */}";

const oldViewStart = appCode.indexOf(viewTarget);
const oldViewEnd = appCode.indexOf(viewEndTarget);

if (oldViewStart > -1 && oldViewEnd > -1) {
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
                  {ct.emailSent} <strong>{formData.email}</strong>. Enter the 6-digit Email OTP below.
                </p>

                <form onSubmit={handleVerifyEmailOTP}>
                  <input required type="text" maxLength="6" value={formData.emailOtp || ''} onChange={e => setFormData({ ...formData, emailOtp: e.target.value })} className="w-full text-center tracking-[0.5em] px-6 py-6 text-4xl font-black rounded-[25px] border-2 border-white/80 bg-white/70 focus:bg-white focus:border-blue-500 outline-none shadow-inner mb-6 text-slate-800" placeholder="••••••" />
                  <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-4 rounded-[30px] shadow-lg transition-all text-xl">Verify Email OTP</button>
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
  console.log('Replaced UI');
}

fs.writeFileSync(appPath, appCode, 'utf8');
console.log('Done');
