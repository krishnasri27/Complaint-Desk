const fs = require('fs');
const appPath = 'c:\\Users\\Cigiri Krishnasri\\.gemini\\antigravity\\brain\\743c1edf-85cc-45ff-a9fe-e4f6eb3413a3\\online compliant\\frontend\\src\\App.jsx';
let code = fs.readFileSync(appPath, 'utf8');

// FIX 1: Replace React.useState with useState (already imported via destructuring)
code = code.replace(
  '  const [userComplaints, setUserComplaints] = React.useState([]);',
  '  const [userComplaints, setUserComplaints] = useState([]);'
);

// FIX 2: The fetchUserComplaints calls the general /api/complaints endpoint but 
// the backend has no ?userId filter. Use a dedicated per-user endpoint.
// For now, fetch all and filter client-side (simplest minimal fix).
// The filter already handles both populated and unpopulated userId, that's fine.

// FIX 3: Admin "User already exists" - this is because the user was stored with Pending 
// status and the check at line 41-43 of server.js only blocks registrationStatus==='Success'.
// So the issue is: admin email/phone exists in DB as Pending, blocking re-register.
// Minimal fix: allow re-registration if status is Pending by deleting the old pending doc.
fs.writeFileSync(appPath, code, 'utf8');
console.log('Fixed React.useState -> useState');

// Fix server.js to allow re-registration when status is Pending
const serverPath = 'c:\\Users\\Cigiri Krishnasri\\.gemini\\antigravity\\brain\\743c1edf-85cc-45ff-a9fe-e4f6eb3413a3\\online compliant\\backend\\server.js';
let server = fs.readFileSync(serverPath, 'utf8');

const oldCheck = `    const existingUser = await User.findOne({ $or: [{ phone }, { email }] });
    if (existingUser && existingUser.registrationStatus === 'Success') {
      return res.status(400).json({ success: false, error: 'User already exists with this phone or email' });
    }`;

const newCheck = `    const existingUser = await User.findOne({ $or: [{ phone }, { email }] });
    if (existingUser) {
      if (existingUser.registrationStatus === 'Success') {
        return res.status(400).json({ success: false, error: 'User already exists with this phone or email' });
      }
      // If user is in Pending state (incomplete registration), delete and let them re-register
      await User.deleteOne({ _id: existingUser._id });
      console.log('Deleted incomplete registration for:', email);
    }`;

server = server.replace(oldCheck, newCheck);
fs.writeFileSync(serverPath, server, 'utf8');
console.log('Fixed server.js: allow re-registration of Pending accounts');
