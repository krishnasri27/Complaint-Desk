const fs = require('fs');
const appPath = 'c:\\Users\\Cigiri Krishnasri\\.gemini\\antigravity\\brain\\743c1edf-85cc-45ff-a9fe-e4f6eb3413a3\\online compliant\\frontend\\src\\App.jsx';
let code = fs.readFileSync(appPath, 'utf8');

// Update renderHeaderControls to include Dashboard and Logout when logged in
const oldHeader = `  const renderHeaderControls = () => (
    <div className="flex items-center space-x-3 absolute top-6 right-6 z-50">
      <button onClick={() => navigateTo('help')} className="p-3 bg-white/40 backdrop-blur-md rounded-[30px] font-bold shadow-sm border border-white/50 text-slate-800 hover:bg-white">{ct.demoTitle}</button>
      <div className="bg-white/40 backdrop-blur-md rounded-[30px] p-1.5 flex shadow-sm border border-white/50">
        {['en', 'hi', 'te'].map(l => (
          <button key={l} onClick={() => setLang(l)} className={\`px-4 py-2 rounded-[25px] font-bold transition-all text-sm uppercase \${lang === l ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-800'}\`}>{l}</button>
        ))}
      </div>
      <button onClick={playAudio} className={\`p-3 rounded-[30px] shadow-sm transition-all backdrop-blur-md border \${isPlaying ? 'bg-blue-100/90 border-blue-200 text-blue-700' : 'bg-white/50 border-white/60 text-slate-600 hover:bg-white/80 hover:shadow-md'}\`} title="Hindi Audio Guide">
        {isPlaying ? <HiOutlineSpeakerWave className="w-6 h-6 animate-pulse" /> : <HiOutlineSpeakerXMark className="w-6 h-6" />}
      </button>
    </div>
  );`;

const newHeader = `  const renderHeaderControls = () => (
    <div className="flex items-center space-x-3 absolute top-6 right-6 z-50">
      {currentUser && (
        <button 
          onClick={() => currentUser.role === 'admin' ? navigateTo('adminDashboard') : navigateTo('userDashboard')} 
          className="p-3 bg-blue-600 text-white rounded-[30px] font-bold shadow-md hover:bg-blue-700 transition-all text-sm px-6"
        >
          Dashboard
        </button>
      )}
      {currentUser && (
        <button 
          onClick={() => { setCurrentUser(null); navigateTo('login'); }} 
          className="p-3 bg-slate-800 text-white rounded-[30px] font-bold shadow-md hover:bg-slate-900 transition-all text-sm px-6"
        >
          Logout
        </button>
      )}
      <button onClick={() => navigateTo('help')} className="p-3 bg-white/40 backdrop-blur-md rounded-[30px] font-bold shadow-sm border border-white/50 text-slate-800 hover:bg-white">{ct.demoTitle}</button>
      <div className="bg-white/40 backdrop-blur-md rounded-[30px] p-1.5 flex shadow-sm border border-white/50">
        {['en', 'hi', 'te'].map(l => (
          <button key={l} onClick={() => setLang(l)} className={\`px-4 py-2 rounded-[25px] font-bold transition-all text-sm uppercase \${lang === l ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-800'}\`}>{l}</button>
        ))}
      </div>
      <button onClick={playAudio} className={\`p-3 rounded-[30px] shadow-sm transition-all backdrop-blur-md border \${isPlaying ? 'bg-blue-100/90 border-blue-200 text-blue-700' : 'bg-white/50 border-white/60 text-slate-600 hover:bg-white/80 hover:shadow-md'}\`} title="Hindi Audio Guide">
        {isPlaying ? <HiOutlineSpeakerWave className="w-6 h-6 animate-pulse" /> : <HiOutlineSpeakerXMark className="w-6 h-6" />}
      </button>
    </div>
  );`;

code = code.replace(oldHeader, newHeader);

fs.writeFileSync(appPath, code, 'utf8');
console.log('Added Dashboard and Logout buttons to header.');
