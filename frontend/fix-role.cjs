const fs = require('fs');

// Fix server.js login route - role check logic
const serverPath = 'c:\\Users\\Cigiri Krishnasri\\.gemini\\antigravity\\brain\\743c1edf-85cc-45ff-a9fe-e4f6eb3413a3\\online compliant\\backend\\server.js';
let code = fs.readFileSync(serverPath, 'utf8');

// Fix the role check - the condition was backwards
const oldRoleCheck = `    if (user.role !== role && role === 'admin') return res.status(403).json({ success: false, error: 'Access Denied. Not an admin.' });\r\n    if (user.role === 'admin' && role === 'user') return res.status(403).json({ success: false, error: 'Admin cannot login as user.' });`;

const newRoleCheck = `    if (role === 'admin' && user.role !== 'admin') return res.status(403).json({ success: false, error: 'Access Denied. Not an admin.' });
    if (role === 'user' && user.role === 'admin') return res.status(403).json({ success: false, error: 'Admin must login using Admin tab.' });`;

code = code.replace(oldRoleCheck, newRoleCheck);
fs.writeFileSync(serverPath, code, 'utf8');
console.log('Fixed server.js role check logic');

// Fix App.jsx - show alert on login error, not just console.error
const appPath = 'c:\\Users\\Cigiri Krishnasri\\.gemini\\antigravity\\brain\\743c1edf-85cc-45ff-a9fe-e4f6eb3413a3\\online compliant\\frontend\\src\\App.jsx';
let appCode = fs.readFileSync(appPath, 'utf8');

const oldCatch = `    } catch (err) {
      console.error('Login error:', err);
    }`;

const newCatch = `    } catch (err) {
      console.error('Login error:', err);
      alert('Failed to connect to server. Make sure the backend is running.');
    }`;

appCode = appCode.replace(oldCatch, newCatch);
fs.writeFileSync(appPath, appCode, 'utf8');
console.log('Fixed App.jsx login error alert');
