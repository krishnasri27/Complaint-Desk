const fs = require('fs');
const fp = 'c:\\Users\\Cigiri Krishnasri\\.gemini\\antigravity\\brain\\743c1edf-85cc-45ff-a9fe-e4f6eb3413a3\\online compliant\\frontend\\src\\App.jsx';
let lines = fs.readFileSync(fp, 'utf8').split('\n');

// 1. Remove the duplicate handleVerifyEmailOTP (lines ~297-311)
//    Find and remove the second one
let foundFirst = false;
let dupStart = -1, dupEnd = -1;
for(let i = 0; i < lines.length; i++) {
  if (lines[i].includes('const handleVerifyEmailOTP = async')) {
    if (!foundFirst) { foundFirst = true; continue; }
    // second occurrence
    dupStart = i;
  }
  if (dupStart > -1 && i > dupStart && lines[i].trim() === '};') {
    dupEnd = i;
    break;
  }
}
if (dupStart > -1 && dupEnd > -1) {
  lines.splice(dupStart - 1, dupEnd - dupStart + 2); // also remove blank line before
  console.log('Removed duplicate handleVerifyEmailOTP at line', dupStart);
}

// 2. Fix broken "  };" after the first handleVerifyEmailOTP
// line 297 originally: "  };" + "  };"
// After the first function closes with "  };", there's a stray extra "  };"
// Let's just scan for two "  };" in a row and remove the duplicate
for(let i = 1; i < lines.length - 1; i++) {
  if (lines[i].trim() === '};' && lines[i+1].trim() === '') {
    // ok
  }
}

// 3. Fix login catch: remove the fallback that auto-navigates on error  
for(let i = 0; i < lines.length; i++) {
  if (lines[i].includes("if (loginForm.role === 'admin') { fetchComplaints(); navigateTo('adminDashboard'); } else navigateTo('complaintForm');")) {
    // Check context - it should be inside a catch block
    if (i > 0 && lines[i-1].includes('} catch (err) {')) {
      lines[i] = "      console.error('Login error:', err);";
      console.log('Fixed login catch fallback at line', i+1);
    }
  }
}

// 4. After registration OTP verify success, navigate to complaintForm directly
for(let i = 0; i < lines.length; i++) {
  if (lines[i].includes('navigateTo(\'login\');') && i > 5) {
    // look back to confirm this is inside handleVerifyEmailOTP
    let context = lines.slice(Math.max(0, i-15), i).join('\n');
    if (context.includes('handleVerifyEmailOTP')) {
      lines[i] = "        navigateTo(\'login\'); // user must login after verification";
      console.log('OTP success navigates to login');
      break;
    }
  }
}

// 5. Add handleUpdateStatus function before handleAudioRecording
const handleAudioLine = lines.findIndex(l => l.includes('const handleAudioRecording = async'));
if (handleAudioLine > -1 && !lines.some(l => l.includes('handleUpdateStatus'))) {
  const newFn = `
  const handleUpdateStatus = async (complaintId, newStatus) => {
    try {
      const res = await fetch('http://localhost:5000/api/complaints/' + complaintId + '/status', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        setComplaints(prev => prev.map(c => c._id === complaintId ? { ...c, status: newStatus } : c));
      } else { alert('Failed to update status: ' + data.error); }
    } catch (err) { alert('Error updating status'); }
  };
`;
  lines.splice(handleAudioLine, 0, newFn);
  console.log('Added handleUpdateStatus function');
}

// 6. Replace the old admin status display with selectable status buttons
// Find the status div in admin dashboard
for(let i = 0; i < lines.length; i++) {
  if (lines[i].includes('<span className="w-2 h-2 rounded-full bg-blue-500">') && lines[i+1] && lines[i+1].includes('{issue.status}')) {
    // Replace this block with a status dropdown
    const indent = lines[i].match(/^(\s*)/)[1];
    const newStatusBlock = `${indent}<div className="flex flex-wrap gap-2 mt-3">
${indent}  {['Pending','Verified','Unreviewed','Resolved'].map(s => (
${indent}    <button key={s} onClick={() => handleUpdateStatus(issue._id, s)}
${indent}      className={\`px-3 py-1 rounded-full text-xs font-bold border-2 transition-all \${
${indent}        issue.status === s
${indent}          ? 'bg-blue-600 text-white border-blue-600'
${indent}          : 'bg-white/70 text-slate-600 border-slate-200 hover:border-blue-400 hover:text-blue-600'
${indent}      }\`}>{s}</button>
${indent}  ))}
${indent}</div>`;
    // remove 3 lines (the old span + {issue.status} + closing </div>)
    lines.splice(i - 1, 5, newStatusBlock);
    console.log('Replaced status display with status buttons at line', i);
    break;
  }
}

// 7. Fix the speaker icon - restore HiOutlineSpeakerWave  
// Check import line
for(let i = 0; i < lines.length; i++) {
  if (lines[i].includes('HiOutlineSpeakerWave') && lines[i].includes('import')) {
    console.log('Speaker import found at line', i+1, '- OK');
    break;
  }
}

fs.writeFileSync(fp, lines.join('\n'), 'utf8');
console.log('App.jsx updated successfully');
