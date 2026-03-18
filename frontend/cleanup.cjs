const fs = require('fs');
const filepath = 'c:\\Users\\Cigiri Krishnasri\\.gemini\\antigravity\\brain\\743c1edf-85cc-45ff-a9fe-e4f6eb3413a3\\online compliant\\frontend\\src\\App.jsx';
let code = fs.readFileSync(filepath, 'utf8');

// Clean up the handles
code = code.replace(/const handleVerifyEmailOTP = async \([\s\S]*?\} catch \(err\) \{ alert\('Error verifying email OTP'\); \}\n  \};\n  \};\n/, '');

const v1 = `const handleVerifyOTP = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: formData.phone, otp: formData.otp })
      });
      const data = await res.json();
      if (data.success) {
        if (data.devLink) {
          // Dev fallback â€” Gmail not configured yet, show clickable link
          setFormData({ ...formData, devVerifyLink: data.devLink });
        }
        navigateTo('registerPending');
      } else { alert(data.error); }
    } catch (err) { navigateTo('registerPending'); }
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

const newV1 = `
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

code = code.replace(v1, newV1);

// Clean up the views
const v2 = `{/* ── OTP VERIFY ── */}
          {/* ── EMAIL PENDING (NOW EMAIL OTP) ── */}
          {view === 'registerPending' && (`;

code = code.replace(v2, `{/* ── EMAIL PENDING (NOW EMAIL OTP) ── */}
          {view === 'registerPending' && (`);

// also let's make sure navigateTo('registerPending') is called in handleRegisterStep1 instead of registerOTP
const r1 = `const otpMsg = data.devOtp
          ? 'Your OTP is: ' + data.devOtp + '\\nEnter this code on the next screen.'
          : 'OTP sent! Check the backend terminal console for your 6-digit code.';
        alert(otpMsg);
        navigateTo('registerOTP');`;

code = code.replace(r1, `alert('OTP sent to your email. Check your inbox to complete verification.');
        navigateTo('registerPending');`);

code = code.replace(`} catch (err) { console.log(err); navigateTo('registerOTP'); }`, `} catch (err) { console.log(err); alert('Failed to connect to server.'); }`);

// Add in the phone validation to register
const valStart = `const handleRegisterStep1 = async (e) => {
    e.preventDefault();`;
code = code.replace(valStart, `const handleRegisterStep1 = async (e) => {
    e.preventDefault();
    if (!/^[6-9]\\d{9}$/.test(formData.phone)) {
      alert("Phone number must be exactly 10 digits and start with 6, 7, 8, or 9.");
      return;
    }`);

fs.writeFileSync(filepath, code, 'utf8');
console.log("Cleaned up App.jsx");
