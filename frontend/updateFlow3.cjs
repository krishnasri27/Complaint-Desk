const fs = require('fs');
let appCode = fs.readFileSync('c:\\Users\\Cigiri Krishnasri\\.gemini\\antigravity\\brain\\743c1edf-85cc-45ff-a9fe-e4f6eb3413a3\\online compliant\\frontend\\src\\App.jsx', 'utf8');

const regStep1StartFn = `  const handleRegisterStep1 = async (e) => {`;
const regStep1EndFn = `} catch (err) { console.log(err); navigateTo('registerOTP'); }
  };`;

// Replace handleRegisterStep1 perfectly
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

// Remove registerOTP view entirely
const otpViewStartText = `{view === 'registerOTP'`;
let beforeOtp = appCode.substring(0, appCode.indexOf(otpViewStartText));
let afterOtpStart = appCode.substring(appCode.indexOf(otpViewStartText));
let nextViewIndex = afterOtpStart.search(/\{\/\* ──/);

if(nextViewIndex > -1 && appCode.indexOf(otpViewStartText) > -1) {
    let afterOtp = afterOtpStart.substring(nextViewIndex);
    appCode = beforeOtp + afterOtp;
}

fs.writeFileSync('c:\\Users\\Cigiri Krishnasri\\.gemini\\antigravity\\brain\\743c1edf-85cc-45ff-a9fe-e4f6eb3413a3\\online compliant\\frontend\\src\\App.jsx', appCode, 'utf8');
console.log("Updated frontend flow successfully");
