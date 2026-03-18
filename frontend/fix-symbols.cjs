const fs = require('fs');
const filepath = 'c:\\Users\\Cigiri Krishnasri\\.gemini\\antigravity\\brain\\743c1edf-85cc-45ff-a9fe-e4f6eb3413a3\\online compliant\\frontend\\src\\App.jsx';
let code = fs.readFileSync(filepath, 'utf8');

const r1 = `  ><HiOutlineSpeakerWave className="w-5 h-5 inline-block" /></button>`;
code = code.replace(/  >ðŸ”Š<\/button>/g, r1);

const t2 = `{r === 'user' ? 'ðŸ‘¤ ' + ct.userRole : 'ðŸ›¡ ' + ct.adminRole}`;
const r2 = `{r === 'user' ? <><HiOutlineUserCircle className="inline w-5 h-5 mr-1 align-text-bottom"/> {ct.userRole}</> : <><HiShieldCheck className="inline w-5 h-5 mr-1 align-text-bottom"/> {ct.adminRole}</>}`;
code = code.replace(t2, r2);

const t3 = `âš  Admin accounts require additional approval.`;
const r3 = `<HiExclamationTriangle className="inline w-5 h-5 mr-1 align-text-bottom text-amber-600" /> Admin accounts require additional approval.`;
code = code.replace(t3, r3);

fs.writeFileSync(filepath, code, 'utf8');
console.log('Symbols restored.');
