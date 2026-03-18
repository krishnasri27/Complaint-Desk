const fs = require('fs');

let appCode = fs.readFileSync('c:\\Users\\Cigiri Krishnasri\\.gemini\\antigravity\\brain\\743c1edf-85cc-45ff-a9fe-e4f6eb3413a3\\online compliant\\frontend\\src\\App.jsx', 'utf8');

// 1. Replace Register Step 1
const regMatch = `  const handleRegisterStep1 = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/auth/register-step1', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: formData.name, phone: formData.phone, email: formData.email, password: formData.password, role: formData.role })
      });
      const data = await res.json();
      if (data.success) {
        const otpMsg = data.devOtp
          ? 'Your OTP is: ' + data.devOtp + '\\nEnter this code on the next screen.'
          : 'OTP sent! Check the backend terminal console for your 6-digit code.';
        alert(otpMsg);
        navigateTo('registerOTP');
      } else { alert(data.error); }
    } catch (err) { console.log(err); navigateTo('registerOTP'); }
  };`;

const newRegMatch = `  const handleRegisterStep1 = async (e) => {
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

if (appCode.includes(`const res = await fetch('http://localhost:5000/api/auth/register-step1'`)) {
   // Less fragile replacement
   const r1Start = appCode.indexOf("const handleRegisterStep1 = async (e) => {");
   const r1EndMatch = "} catch (err) { navigateTo('registerPending'); }";
   const r1EndMatch2 = "} catch (err) { console.log(err); navigateTo('registerOTP'); }";
   
   let r1End = appCode.indexOf(r1EndMatch, r1Start);
   if(r1End === -1) r1End = appCode.indexOf(r1EndMatch2, r1Start);
   
   if(r1Start > -1 && r1End > -1) {
       const replaceTarget = appCode.substring(r1Start, r1End + (r1End === appCode.indexOf(r1EndMatch) ? r1EndMatch.length : r1EndMatch2.length));
       appCode = appCode.replace(replaceTarget, newRegMatch.trim());
       console.log("Replaced step 1 and added verify email otp");
   }
}

// 2. Remove old OTP view and replace registerPending
const otpViewStartText = `{view === 'registerOTP'`;
let beforeOtp = appCode.substring(0, appCode.indexOf(otpViewStartText));
let afterOtpStart = appCode.substring(appCode.indexOf(otpViewStartText));
let nextViewIndex = afterOtpStart.search(/\{\/\* ── EMAIL PENDING ── \*\/\}/);
if (nextViewIndex === -1) nextViewIndex = afterOtpStart.search(/\{\/\* ── EMAIL PENDING \(NOW EMAIL OTP\) ── \*\/\}/);

if(nextViewIndex > -1 && appCode.indexOf(otpViewStartText) > -1) {
    let afterOtp = afterOtpStart.substring(nextViewIndex);
    appCode = beforeOtp + afterOtp;
    console.log("Removed old phone OTP view");
}

let rpStart = appCode.indexOf("{/* ── EMAIL PENDING ── */}");
if (rpStart === -1) rpStart = appCode.indexOf("{/* ── EMAIL PENDING (NOW EMAIL OTP) ── */}");

let rpEnd = appCode.indexOf("{/* ── COMPLAINT FORM ── */}");
if (rpEnd === -1) rpEnd = appCode.indexOf("{/* ── DASHBOARD ── */}");

if (rpStart > -1 && rpEnd > -1) {
   const newView = `{/* ── EMAIL PENDING (NOW EMAIL OTP) ── */}
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
   const toReplace = appCode.substring(rpStart, rpEnd);
   appCode = appCode.replace(toReplace, newView);
   console.log("Replaced email pending UI with Email OTP form");
}

fs.writeFileSync('c:\\Users\\Cigiri Krishnasri\\.gemini\\antigravity\\brain\\743c1edf-85cc-45ff-a9fe-e4f6eb3413a3\\online compliant\\frontend\\src\\App.jsx', appCode, 'utf8');
console.log("Done");
