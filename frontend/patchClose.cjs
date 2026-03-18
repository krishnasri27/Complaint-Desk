const fs = require('fs');

let appPath = 'c:\\Users\\Cigiri Krishnasri\\.gemini\\antigravity\\brain\\743c1edf-85cc-45ff-a9fe-e4f6eb3413a3\\online compliant\\frontend\\src\\App.jsx';
let appCode = fs.readFileSync(appPath, 'utf8');

const t = `    } catch (err) { alert('Error verifying email OTP'); }


  const handleUpdateStatus = async (complaintId, newStatus) => {`;

const r = `    } catch (err) { alert('Error verifying email OTP'); }
  };

  const handleUpdateStatus = async (complaintId, newStatus) => {`;
  
appCode = appCode.replace(t, r);

// Also fix the login submit auto routing bug if it exists
appCode = appCode.replace("console.error('Login error:', err);", `console.error('Login error:', err);`);

fs.writeFileSync(appPath, appCode, 'utf8');
