const fs = require('fs');
const serverPath = 'c:\\Users\\Cigiri Krishnasri\\.gemini\\antigravity\\brain\\743c1edf-85cc-45ff-a9fe-e4f6eb3413a3\\online compliant\\backend\\server.js';
let code = fs.readFileSync(serverPath, 'utf8');

// FIX 1: Normalize email/phone on registration so they're stored consistently
const oldRegisterDestructure = `    const { name, phone, email, password, role } = req.body;
    
    // Validate phone number`;

const newRegisterDestructure = `    const { name, password, role } = req.body;
    const email = (req.body.email || '').trim().toLowerCase();
    const phone = (req.body.phone || '').trim();

    // Validate phone number`;

code = code.replace(oldRegisterDestructure, newRegisterDestructure);

// FIX 2: Normalize identifier on login so spaces/caps don't break lookup
const oldLoginDestructure = `    const { identifier, password, role } = req.body;
    // Step 1: Find the user by email OR phone only (not password in query)
    const user = await User.findOne({ $or: [{ email: identifier }, { phone: identifier }] });`;

const newLoginDestructure = `    const { password, role } = req.body;
    const identifier = (req.body.identifier || '').trim().toLowerCase();
    // Step 1: Find the user by email OR phone only (not password in query)
    const user = await User.findOne({ $or: [{ email: identifier }, { phone: identifier.replace(/^\\+91/, '') }] });`;

code = code.replace(oldLoginDestructure, newLoginDestructure);

fs.writeFileSync(serverPath, code, 'utf8');
console.log('Fixed: email/phone now normalized (trim + toLowerCase) on both register and login.');
console.log('IMPORTANT: Restart backend with: node server.js');
