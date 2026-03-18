const fs = require('fs');
const appPath = 'c:\\Users\\Cigiri Krishnasri\\.gemini\\antigravity\\brain\\743c1edf-85cc-45ff-a9fe-e4f6eb3413a3\\online compliant\\frontend\\src\\App.jsx';
let code = fs.readFileSync(appPath, 'utf8');

// FIX 1: Change login navigation for user: instead of 'complaintForm', go to 'userDashboard'
code = code.replace(
  `if (data.user.role === 'admin') { fetchComplaints(); navigateTo('adminDashboard'); } else navigateTo('complaintForm');`,
  `if (data.user.role === 'admin') { fetchComplaints(); navigateTo('adminDashboard'); } else { fetchUserComplaints(data.user._id); navigateTo('userDashboard'); }`
);

// FIX 2: Add fetchUserComplaints function right after fetchComplaints
const fetchComplaintsFunc = `  const fetchComplaints = async () => {`;
const fetchUserComplaintsFunc = `  const [userComplaints, setUserComplaints] = React.useState([]);

  const fetchUserComplaints = async (userId) => {
    try {
      const res = await fetch('http://localhost:5000/api/complaints?userId=' + userId);
      const data = await res.json();
      if (data.success) setUserComplaints(data.data.filter(c => c.userId && (c.userId._id === userId || c.userId === userId)));
    } catch (err) { console.log(err); }
  };

  const fetchComplaints = async () => {`;
code = code.replace(fetchComplaintsFunc, fetchUserComplaintsFunc);

// FIX 3: Allow admin to register via login page — show register button for both roles
code = code.replace(
  `{loginForm.role === 'user' && (
                      <button type="button" onClick={() => navigateTo('register')} className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-4 rounded-[30px] shadow-lg transition-all text-lg">{ct.registerNew}</button>
                    )}`,
  `<button type="button" onClick={() => navigateTo('register')} className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-4 rounded-[30px] shadow-lg transition-all text-lg">{ct.registerNew}</button>`
);

// FIX 4: Add user dashboard view after the OTP verify view (before complaintForm)
const insertBefore = `          {/* ── COMPLAINT FORM ── */}`;
const userDashboardView = `          {/* ── USER DASHBOARD ── */}
          {view === 'userDashboard' && (
            <motion.div key="userDashboard" variants={pageVariants} initial="initial" animate="in" exit="out" className="w-full max-w-4xl mx-auto">
              <div className={glassCard}>
                <div className="flex items-center justify-between mb-8 border-b border-slate-200/50 pb-4">
                  <h2 className="text-2xl font-black text-slate-800">My Complaints</h2>
                  <button onClick={() => navigateTo('complaintForm')} className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-[25px] shadow-lg transition-all flex items-center gap-2">
                    <HiOutlineDocumentText className="w-5 h-5" /> New Complaint
                  </button>
                </div>
                {userComplaints.length === 0 ? (
                  <div className="text-center py-16">
                    <HiOutlineDocumentText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500 font-medium text-lg">No complaints submitted yet.</p>
                    <button onClick={() => navigateTo('complaintForm')} className="mt-6 bg-blue-600 text-white font-bold px-8 py-3 rounded-[25px] shadow-lg hover:bg-blue-700 transition-all">Submit Your First Complaint</button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userComplaints.map(c => (
                      <div key={c._id} className="bg-white/80 p-5 rounded-[20px] border border-white/80 shadow-sm flex justify-between items-center">
                        <div>
                          <h3 className="text-lg font-bold text-slate-800">{c.title}</h3>
                          <p className="text-sm text-blue-600 font-semibold uppercase tracking-wide mt-1">{c.category} • ID: {c.complaintId}</p>
                          <p className="text-sm text-slate-500 mt-1">{c.description?.slice(0, 80)}...</p>
                        </div>
                        <span className={\`ml-4 px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap \${
                          c.status === 'Resolved' ? 'bg-green-100 text-green-700' :
                          c.status === 'Verified' ? 'bg-blue-100 text-blue-700' :
                          c.status === 'Unreviewed' ? 'bg-slate-100 text-slate-600' :
                          'bg-amber-100 text-amber-700'
                        }\`}>{c.status || 'Pending'}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

`;
code = code.replace(insertBefore, userDashboardView + insertBefore);

fs.writeFileSync(appPath, code, 'utf8');
console.log('Done. User dashboard added, admin registration unlocked, login routing fixed.');
