/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HiShieldCheck, HiOutlineSpeakerWave, HiOutlineSpeakerXMark, HiArrowLeft, 
  HiVideoCamera, HiChevronDown, HiChevronUp, HiExclamationTriangle, 
  HiOutlineMapPin, HiOutlineMicrophone, HiOutlineDocumentText, HiOutlineUserCircle
} from 'react-icons/hi2';
import { speak } from './utils/speech';

// --- Constants ----------------------------------------------------------------
const glassCard = "bg-white/60 backdrop-blur-[10px] border border-white/50 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.2)] rounded-[30px] p-8 md:p-12 relative z-10 w-full";

// FEATURE 4 â€” Proper Devanagari Hindi welcome script
const hindiAudioScript = "नमस्ते! रजिस्ट्रेशन प्रक्रिया शुरू करने के लिए अपना नाम, फोन नंबर, ईमेल और OTP भरें। सबमिट करने के बाद अपनी ईमेल चेक करें। हमने वहां एक वेरिफिकेशन लिंक भेजा है। ध्यान दें: रजिस्ट्रेशन तभी पूरा होगा जब आप उस लिंक पर क्लिक करेंगे और आपका फोन नंबर सिस्टम से मैच होगा। हर पेज पर पीछे जाने के लिए 'Back' बटन का विकल्प दिया गया है।";
const hinglishAudioScript = hindiAudioScript; // kept for backward compat

// FEATURE 3 â€” language ? BCP-47 code map used by speak()
const langCodeMap = { en: "en-US", hi: "hi-IN", te: "te-IN" };

// --- Translations -------------------------------------------------------------
const t = {
  en: {
    appTitle: "Complaint Desk",
    welcome: "Welcome securely. Please log in or register.",
    userRole: "User", adminRole: "Admin",
    loginIdentifier: "Email or Phone", password: "Password",
    loginSecurely: "Login Securely", registerNew: "Register New Account",
    demoTitle: "Help / Demo", demoDesc: "Watch how to use the system",
    createAccount: "Create Account", step1: "Step 1: Enter your primary details.",
    fullName: "Full Name", phone1: "Phone Number", email2: "Email Address",
    sendOtp: "Send OTP", verifyPhone: "Verify Phone", otpSent: "We sent an OTP to",
    verifyAndLink: "Verify & Register", checkEmail: "Check Your Email",
    channel1Ver: "Registration Pending", emailSent: "An activation link has been sent to",
    finalEmail: "Click it to finalize registration.", awaitingClick: "Awaiting Email Verification",
    back: "Back", submitTitle: "Submit a Complaint", titleLabel: "Title",
    catLabel: "Category (No Infrastructure)", descLabel: "Description",
    locBtn: "Get Exact Location", locGot: "Location Detected",
    audioLabel: "Record Audio Evidence", audioRecorded: "Audio Recorded",
    evidenceLabel: "Upload Evidence (Images, Video, Docs)",
    anonymousLabel: "Submit Anonymously", submitBtn: "Submit Complaint",
    trackTitle: "Track Complaint", enterComplaintId: "Enter Complaint ID",
    trackBtn: "Track Status",
    categories: ["Theft", "Violence", "Harassment", "Corruption", "Suspicious Activity"],
    dashTitle: "Admin Dashboard", noIssues: "No complaints found.", loc: "Location", statusLabel: "Status",
    // FEATURE 2 & 3 â€” per-field audio instructions
    audioInstructions: {
      pageWelcome: "Welcome to Complaint Desk. Click on any field to hear instructions for filling the form.",
      identifier: "Enter your registered email address or phone number.",
      password:   "Enter your secure password.",
      fullName:   "Enter your full name as it appears on your ID.",
      phone:      "Enter the mobile phone number you want to register with.",
      email:      "Enter your email address. A verification link will be sent here.",
      otp:        "Enter the 6-digit OTP sent to your phone.",
      title:      "Write a short title that describes your complaint.",
      category:   "Choose the category that best matches your complaint.",
      description:"Describe your complaint in detail. Include what happened, when and where.",
      location:   "Click this button to automatically capture your current GPS location.",
      audioRec:   "Click to start recording your verbal statement as audio evidence.",
      evidence:   "Upload photos, videos, documents, or audio files as evidence.",
      anonymous:  "Check this box if you want to submit the complaint without revealing your identity.",
      trackId:    "Enter the unique complaint ID you received after submitting, for example: CD-2026-123456.",
    }
  },
  hi: {
    appTitle: "Complaint Desk",
    welcome: "सुरक्षित स्वागत है। लॉगिन करें या रजिस्टर करें।",
    userRole: "यूज़र", adminRole: "एडमिन",
    loginIdentifier: "ईमेल या फोन", password: "पासवर्ड",
    loginSecurely: "सुरक्षित लॉगिन करें", registerNew: "नया खाता बनाएं",
    demoTitle: "सहायता / डेमो", demoDesc: "सिस्टम का उपयोग देखें",
    createAccount: "खाता बनाएं", step1: "पहला कदम: अपनी जानकारी भरें।",
    fullName: "पूरा नाम", phone1: "फोन नंबर", email2: "ईमेल पता",
    sendOtp: "OTP भेजें", verifyPhone: "फोन सत्यापित करें", otpSent: "हमने OTP भेजा है",
    verifyAndLink: "सत्यापित करें और रजिस्टर करें", checkEmail: "अपना ईमेल जांचें",
    channel1Ver: "रजिस्ट्रेशन लंबित है", emailSent: "एक लिंक भेजा गया है",
    finalEmail: "रजिस्ट्रेशन पूरा करने के लिए क्लिक करें।", awaitingClick: "ईमेल सत्यापन का इंतज़ार",
    back: "पीछे जाएं", submitTitle: "शिकायत दर्ज करें", titleLabel: "शीर्षक",
    catLabel: "श्रेणी", descLabel: "विवरण",
    locBtn: "स्थान प्राप्त करें", locGot: "स्थान मिल गया",
    audioLabel: "ऑडियो साक्ष्य रिकॉर्ड करें", audioRecorded: "ऑडियो रिकॉर्ड हो गया",
    evidenceLabel: "साक्ष्य अपलोड करें (फोटो, वीडियो, दस्तावेज़)",
    anonymousLabel: "गुमनाम शिकायत दर्ज करें", submitBtn: "जमा करें",
    trackTitle: "शिकायत ट्रैक करें", enterComplaintId: "शिकायत ID दर्ज करें",
    trackBtn: "स्थिति जांचें",
    categories: ["Theft", "Violence", "Harassment", "Corruption", "Suspicious Activity"],
    dashTitle: "एडमिन डैशबोर्ड", noIssues: "कोई शिकायत नहीं मिली।", loc: "स्थान", statusLabel: "स्थिति",
    audioInstructions: {
      pageWelcome: "Complaint Desk में आपका स्वागत है। किसी भी फील्ड पर क्लिक करें और फॉर्म भरने के निर्देश सुनें।",
      identifier: "अपना पंजीकृत ईमेल पता या फोन नंबर दर्ज करें।",
      password:   "अपना सुरक्षित पासवर्ड दर्ज करें।",
      fullName:   "अपना पूरा नाम दर्ज करें जैसा आपके आईडी पर है।",
      phone:      "वह मोबाइल नंबर दर्ज करें जिससे आप रजिस्टर करना चाहते हैं।",
      email:      "अपना ईमेल पता दर्ज करें। यहां एक वेरिफिकेशन लिंक भेजा जाएगा।",
      otp:        "अपने फोन पर भेजा गया 6 अंकों का OTP दर्ज करें।",
      title:      "अपनी शिकायत का एक संक्षिप्त शीर्षक लिखें।",
      category:   "वह श्रेणी चुनें जो आपकी शिकायत से सबसे अच्छी तरह मेल खाती हो।",
      description:"अपनी शिकायत का विस्तृत विवरण दें। क्या हुआ, कब और कहां, यह लिखें।",
      location:   "अपना वर्तमान GPS स्थान स्वचालित रूप से रिकॉर्ड करने के लिए इस बटन पर क्लिक करें।",
      audioRec:   "अपना मौखिक बयान ऑडियो साक्ष्य के रूप में रिकॉर्ड करने के लिए क्लिक करें।",
      evidence:   "साक्ष्य के रूप में फोटो, वीडियो, दस्तावेज़ या ऑडियो फ़ाइलें अपलोड करें।",
      anonymous:  "यदि आप अपनी पहचान छुपाकर शिकायत दर्ज करना चाहते हैं तो यह बॉक्स चेक करें।",
      trackId:    "जमा करने के बाद मिला शिकायत ID दर्ज करें, जैसे: CD-2026-123456।",
    }
  },
  te: {
    appTitle: "కంప్లైంట్ డెస్క్",
    welcome: "సురక్షిత స్వాగతం. లాగిన్ చేయండి లేదా నమోదు చేయండి.",
    userRole: "యూజర్", adminRole: "అడ్మిన్",
    loginIdentifier: "ఇమెయిల్ లేదా ఫోన్", password: "పాస్వర్డ్",
    loginSecurely: "సురక్షితంగా లాగిన్ చేయండి", registerNew: "కొత్త ఖాతా సృష్టించండి",
    demoTitle: "సహాయం / డెమో", demoDesc: "ఎలా ఉపయోగించాలో చూడండి",
    createAccount: "ఖాతా సృష్టించండి", step1: "దశ 1: మీ వివరాలను నమోదు చేయండి.",
    fullName: "పూర్తి పేరు", phone1: "ఫోన్ నంబర్", email2: "ఇమెయిల్ చిరునామా",
    sendOtp: "OTP పంపండి", verifyPhone: "ఫోన్ ధృవీకరించండి", otpSent: "మేము OTP పంపాము",
    verifyAndLink: "ధృవీకరించండి మరియు నమోదు చేయండి", checkEmail: "మీ ఇమెయిల్ తనిఖీ చేయండి",
    channel1Ver: "నమోదు పెండింగ్‌లో ఉంది", emailSent: "యాక్టివేషన్ లింక్ పంపబడింది",
    finalEmail: "నమోదు పూర్తి చేయడానికి క్లిక్ చేయండి.", awaitingClick: "ఇమెయిల్ క్లిక్ కోసం వేచి ఉంది",
    back: "వెనుకకు", submitTitle: "ఫిర్యాదు సమర్పించండి", titleLabel: "శీర్షిక",
    catLabel: "వర్గం", descLabel: "వివరణ",
    locBtn: "స్థానం పొందండి", locGot: "స్థానం దొరికింది",
    audioLabel: "ఆడియో సాక్ష్యం రికార్డ్ చేయండి", audioRecorded: "ఆడియో రికార్డ్ చేయబడింది",
    evidenceLabel: "సాక్ష్యం అప్‌లోడ్ చేయండి (ఫోటోలు, వీడియోలు, పత్రాలు)",
    anonymousLabel: "అనామకంగా సమర్పించండి", submitBtn: "సమర్పించు",
    trackTitle: "ఫిర్యాదు ట్రాక్ చేయండి", enterComplaintId: "ఫిర్యాదు ID నమోదు చేయండి",
    trackBtn: "స్థితి తనిఖీ చేయండి",
    categories: ["Theft", "Violence", "Harassment", "Corruption", "Suspicious Activity"],
    dashTitle: "అడ్మిన్ డాష్‌బోర్డ్", noIssues: "ఫిర్యాదులు లేవు.", loc: "స్థానం", statusLabel: "స్థితి",
    audioInstructions: {
      pageWelcome: "Complaint Desk కి స్వాగతం. ఫారం పూరించడానికి సూచనలు వినడానికి ఏదైనా ఫీల్డ్‌పై క్లిక్ చేయండి.",
      identifier: "మీ నమోదు చేసిన ఇమెయిల్ చిరునామా లేదా ఫోన్ నంబర్ నమోదు చేయండి.",
      password:   "మీ సురక్షిత పాస్‌వర్డ్ నమోదు చేయండి.",
      fullName:   "మీ ID లో ఉన్నట్లు మీ పూర్తి పేరు నమోదు చేయండి.",
      phone:      "మీరు నమోదు చేయాలనుకుంటున్న మొబైల్ నంబర్ నమోదు చేయండి.",
      email:      "మీ ఇమెయిల్ చిరునామా నమోదు చేయండి. ఇక్కడ ఒక ధృవీకరణ లింక్ పంపబడుతుంది.",
      otp:        "మీ ఫోన్‌కు పంపబడిన 6-అంకెల OTP నమోదు చేయండి.",
      title:      "మీ ఫిర్యాదు వివరించే క్లుప్త శీర్షిక రాయండి.",
      category:   "మీ ఫిర్యాదుకు బాగా సరిపోయే వర్గాన్ని ఎంచుకోండి.",
      description:"మీ ఫిర్యాదును వివరంగా వివరించండి. ఏం జరిగింది, ఎప్పుడు మరియు ఎక్కడ జరిగిందో రాయండి.",
      location:   "మీ ప్రస్తుత GPS స్థానాన్ని స్వయంచాలకంగా రికార్డ్ చేయడానికి ఈ బటన్‌పై క్లిక్ చేయండి.",
      audioRec:   "మీ మౌఖిక వాంగ్మూలాన్ని ఆడియో సాక్ష్యంగా రికార్డ్ చేయడానికి క్లిక్ చేయండి.",
      evidence:   "సాక్ష్యంగా ఫోటోలు, వీడియోలు, పత్రాలు లేదా ఆడియో ఫైల్‌లు అప్‌లోడ్ చేయండి.",
      anonymous:  "మీ గుర్తింపు బహిర్గతం చేయకుండా ఫిర్యాదు సమర్పించాలంటే ఈ చెక్‌బాక్స్ చెక్ చేయండి.",
      trackId:    "సమర్పించిన తర్వాత మీకు లభించిన ఫిర్యాదు ID నమోదు చేయండి, ఉదాహరణ: CD-2026-123456.",
    }
  }
};

// FEATURE 6 â€” Speaker icon button defined OUTSIDE render to avoid re-creation errors
const SpeakBtn = ({ text, lc }) => (
  <button
    type="button"
    onClick={() => speak(text, lc)}
    title="Click to hear instructions"
    className="ml-2 text-blue-400 hover:text-blue-600 transition-colors text-base select-none"
    aria-label="Audio help"
  ><HiOutlineSpeakerWave className="w-5 h-5 inline-block" /></button>
);
// --- Component ----------------------------------------------------------------
export default function App() {
  const [view, setView] = useState('login');
  const [history, setHistory] = useState([]);

  const [lang, setLang] = useState('en');
  const [isPlaying, setIsPlaying] = useState(false);

  const [loginForm, setLoginForm] = useState({ identifier: '', password: '', role: 'user' });
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', password: '', otp: '', role: 'user' });
  const [currentUser, setCurrentUser] = useState(null);

  const [complaints, setComplaints] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [issueForm, setIssueForm] = useState({
    title: '', category: 'Theft', description: '', lat: null, lng: null, isAnonymous: false, evidence: null
  });

  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const mediaRecorderRef = useRef(null);

  const [trackId, setTrackId] = useState('');
  const [trackedComplaint, setTrackedComplaint] = useState(null);

  const ct = t[lang] || t['en'];
  const lc = langCodeMap[lang] || 'en-US'; 
  const ai = ct.audioInstructions; 


  // --- Navigation -----------------------------------------------------------
  const navigateTo = (newView) => {
    setHistory(prev => [...prev, view]);
    setView(newView);
  };

  const handleBack = () => {
    if (history.length > 0) {
      const prev = history[history.length - 1];
      setHistory(history.slice(0, -1));
      setView(prev);
    }
  };

  // --- Global audio guide (top-right speaker button) ------------------------
  const playAudio = () => {
    if ('speechSynthesis' in window) {
      if (isPlaying) {
        window.speechSynthesis.cancel();
        setIsPlaying(false);
      } else {
        const utterance = new SpeechSynthesisUtterance(hindiAudioScript);
        utterance.lang = 'hi-IN';
        utterance.onend = () => setIsPlaying(false);
        utterance.onerror = (e) => { console.error('Audio Error:', e); setIsPlaying(false); };
        setIsPlaying(true);
        window.speechSynthesis.speak(utterance);
      }
    }
  };

  // Stop global audio on view / language change
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      setIsPlaying(false);
    };
  }, [view, lang]);

  // FEATURE 5 â€” Page-level greeting when login view opens
  useEffect(() => {
    if (view === 'login') {
      const timer = setTimeout(() => speak(ai.pageWelcome, lc), 800);
      return () => clearTimeout(timer);
    }
  }, [view, lang]);

  // --- Animation variants ---------------------------------------------------
  const pageVariants = {
    initial: { opacity: 0, scale: 0.95, y: 30 },
    in:      { opacity: 1, scale: 1,    y: 0  },
    out:     { opacity: 0, scale: 0.95, y: -30 }
  };

  // --- Auth handlers --------------------------------------------------------
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm)
      });
      const data = await res.json();
      if (data.success) {
        setCurrentUser(data.user);
        if (data.user.role === 'admin') { fetchComplaints(); navigateTo('adminDashboard'); } else { fetchUserComplaints(data.user._id); navigateTo('userDashboard'); }
      } else { alert(data.error); }
    } catch (err) {
      console.error('Login error:', err);
      alert('Failed to connect to server. Make sure the backend is running.');
    }
  };

  const handleRegisterStep1 = async (e) => {
    e.preventDefault();
    if (!/^[6-9]\d{9}$/.test(formData.phone)) {
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
        navigateTo('registerPending');
      } else { alert(data.error); }
    } catch (err) { console.log(err); alert('Failed to connect to server.'); }
  };

  const handleVerifyEmailOTP = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/auth/verify-email-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: (formData.phone || '').trim(), emailOtp: (formData.emailOtp || '').trim() })
      });
      const data = await res.json();
      if (data.success) {
        alert(data.message);
        if (data.user && data.user.role === 'admin') {
          fetchComplaints();
          navigateTo('adminDashboard');
        } else if (data.user) {
          fetchUserComplaints(data.user._id);
          navigateTo('userDashboard');
        } else {
          navigateTo('login');
        }
      } else { alert(data.error); }
    } catch (err) { alert('Error verifying email OTP'); }
  };

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

  const handleAudioRecording = async () => {
    if (isRecording) {
      if (mediaRecorderRef.current) mediaRecorderRef.current.stop();
      setIsRecording(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorderRef.current = new MediaRecorder(stream);
        const chunks = [];
        mediaRecorderRef.current.ondataavailable = e => chunks.push(e.data);
        mediaRecorderRef.current.onstop = () => {
          const blob = new Blob(chunks, { type: 'audio/webm' });
          setAudioBlob(blob);
        };
        mediaRecorderRef.current.start();
        setIsRecording(true);
      } catch (err) { alert('Microphone access denied'); }
    }
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setIssueForm({ ...issueForm, lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => alert("Location permission denied.")
      );
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0)
      setIssueForm({ ...issueForm, evidence: e.target.files[0] });
  };

  const handleIssueSubmit = async (e) => {
    e.preventDefault();
    const dataForm = new FormData();
    dataForm.append('title',       issueForm.title);
    dataForm.append('category',    issueForm.category);
    dataForm.append('description', issueForm.description);
    if (issueForm.lat) { dataForm.append('lat', issueForm.lat); dataForm.append('lng', issueForm.lng); }
    dataForm.append('isAnonymous', issueForm.isAnonymous);
    if (currentUser) dataForm.append('userId', currentUser._id);
    if (issueForm.evidence) dataForm.append('evidenceFile', issueForm.evidence);
    if (audioBlob)          dataForm.append('audioEvidence', audioBlob, 'audio.webm');
    try {
      const res  = await fetch('http://localhost:5000/api/complaints', { method: 'POST', body: dataForm });
      const data = await res.json();
      if (data.success) {
        alert("Complaint Submitted! ID: " + data.data.complaintId);
        setIssueForm({ title: '', category: 'Theft', description: '', lat: null, lng: null, isAnonymous: false, evidence: null });
        setAudioBlob(null);
        setView('tracking');
        setTrackId(data.data.complaintId);
        trackComplaint(data.data.complaintId);
      } else { alert(data.error); }
    } catch (err) { alert("Mock Success. Backend offline."); setView('login'); }
  };

  const [userComplaints, setUserComplaints] = useState([]);

  const fetchUserComplaints = async (userId) => {
    try {
      const res = await fetch('http://localhost:5000/api/complaints?userId=' + userId);
      const data = await res.json();
      if (data.success) setUserComplaints(data.data.filter(c => c.userId && (c.userId._id === userId || c.userId === userId)));
    } catch (err) { console.log(err); }
  };

  const fetchComplaints = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/complaints');
      const data = await res.json();
      if (data.success) setComplaints(data.data);
    } catch (err) { console.log(err); }
  };


const trackComplaint = async (idOfComp) => {
    const id = idOfComp || trackId;
    if (!id) return;
    try {
      const res  = await fetch('http://localhost:5000/api/complaints/track/' + id);
      const data = await res.json();
      if (data.success) setTrackedComplaint(data.data);
      else setTrackedComplaint(null);
    } catch (err) { setTrackedComplaint({ title: 'Sample Title', status: 'Submitted', category: 'Theft', evidenceStatus: 'Pending' }); }
  };

  // --- Shared UI helpers ----------------------------------------------------
  const renderHeaderControls = () => (
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
          <button key={l} onClick={() => setLang(l)} className={`px-4 py-2 rounded-[25px] font-bold transition-all text-sm uppercase ${lang === l ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-800'}`}>{l}</button>
        ))}
      </div>
      <button onClick={playAudio} className={`p-3 rounded-[30px] shadow-sm transition-all backdrop-blur-md border ${isPlaying ? 'bg-blue-100/90 border-blue-200 text-blue-700' : 'bg-white/50 border-white/60 text-slate-600 hover:bg-white/80 hover:shadow-md'}`} title="Hindi Audio Guide">
        {isPlaying ? <HiOutlineSpeakerWave className="w-6 h-6 animate-pulse" /> : <HiOutlineSpeakerXMark className="w-6 h-6" />}
      </button>
    </div>
  );

  const renderModuleHeader = (title) => (
    <div className="flex items-center justify-between mb-8 border-b border-slate-200/50 pb-4">
      <button onClick={handleBack} className="flex items-center text-slate-500 hover:text-blue-600 font-bold transition-colors bg-white/40 px-4 py-2 rounded-[30px] shadow-sm hover:shadow-md border border-white/50">
        <HiArrowLeft className="w-5 h-5 mr-2" /> {ct.back}
      </button>
      <h2 className="text-2xl font-black text-slate-800">{title}</h2>
    </div>
  );

  // --- JSX -----------------------------------------------------------------
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-50 font-sans text-slate-800 overflow-hidden relative flex flex-col items-center justify-center">

      <motion.div animate={{ scale: [1, 1.1, 1], rotate: [0, 90, 0] }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-[50%] bg-blue-400/20 blur-[80px] pointer-events-none" />
      <motion.div animate={{ scale: [1, 1.2, 1], rotate: [0, -90, 0] }} transition={{ duration: 25, repeat: Infinity, ease: "linear" }} className="absolute bottom-[-20%] right-[-10%] w-[700px] h-[700px] rounded-[50%] bg-purple-400/20 blur-[80px] pointer-events-none" />

      {renderHeaderControls()}

      <main className="w-full max-w-7xl px-4 sm:px-6 z-10 py-16 flex justify-center items-center flex-1">
        <AnimatePresence mode="wait">

          {/* â”€â”€ LOGIN â”€â”€ */}
          {view === 'login' && (
            <motion.div key="login" variants={pageVariants} initial="initial" animate="in" exit="out" transition={{ duration: 0.5 }} className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">

              <div className={`${glassCard} flex flex-col items-center justify-center text-center !p-10 border-indigo-100`}>
                <div className="w-24 h-24 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-6 shadow-inner">
                  <HiVideoCamera className="w-12 h-12" />
                </div>
                <h2 className="text-3xl font-black text-slate-800 mb-2">{ct.demoTitle}</h2>
                <p className="text-slate-500 font-medium mb-6">{ct.demoDesc}</p>
                
                <div 
                  className="w-full h-48 bg-slate-900/10 rounded-2xl flex flex-col items-center justify-center border border-dashed border-slate-300 mb-4 cursor-pointer hover:bg-blue-50 transition-all group relative overflow-hidden" 
                  onClick={() => navigateTo('help')}
                >
                  <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/5 transition-colors" />
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform z-10">
                    <HiVideoCamera className="w-8 h-8 text-white ml-0.5" />
                  </div>
                  <span className="text-blue-600 font-black uppercase tracking-widest text-xs mt-4 group-hover:text-blue-700 transition-colors z-10 transition-all">Play Accessibility Help</span>
                </div>

                <button type="button" onClick={() => navigateTo('tracking')} className="bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-bold py-3 px-6 rounded-[30px] shadow-sm transition-all w-full flex justify-center items-center">
                  <HiOutlineDocumentText className="w-6 h-6 mr-2" /> {ct.trackTitle}
                </button>
              </div>

              <div className={`${glassCard} !p-10 border-blue-100`}>
                <div className="flex items-center space-x-3 mb-6">
                  <div className="bg-blue-600 p-3 rounded-[20px] shadow-lg shadow-blue-200/50"><HiShieldCheck className="w-8 h-8 text-white" /></div>
                  <h1 className="text-3xl font-black tracking-tight text-slate-800">{ct.appTitle}</h1>
                </div>
                <p className="text-slate-500 font-medium mb-6">{ct.welcome}</p>

                <div className="mb-6 p-1 bg-white/50 backdrop-blur-sm rounded-2xl flex border border-white/60 shadow-inner">
                  {['user', 'admin'].map(r => (
                    <button type="button" key={r} onClick={() => setLoginForm({ ...loginForm, role: r })} className={`flex-1 py-3 px-4 rounded-[15px] text-lg font-bold transition-all ${loginForm.role === r ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                      {r === 'user' ? ct.userRole : ct.adminRole}
                    </button>
                  ))}
                </div>

                <form className="space-y-4" onSubmit={handleLoginSubmit}>
                  <div>
                    <label className="flex items-center text-sm font-bold text-slate-600 mb-1 ml-2 cursor-pointer" onClick={() => speak(ai.identifier, lc)}>
                      {ct.loginIdentifier} <SpeakBtn text={ai.identifier} lc={lc} />
                    </label>
                    <input required placeholder={ct.loginIdentifier} value={loginForm.identifier} onChange={e => setLoginForm({ ...loginForm, identifier: e.target.value })} className="w-full px-6 py-4 text-lg rounded-[25px] border-2 border-white/60 bg-white/50 focus:bg-white focus:border-blue-400 outline-none transition-all shadow-sm" />
                  </div>
                  <div>
                    <label className="flex items-center text-sm font-bold text-slate-600 mb-1 ml-2 cursor-pointer" onClick={() => speak(ai.password, lc)}>
                      {ct.password} <SpeakBtn text={ai.password} lc={lc} />
                    </label>
                    <input type="password" required placeholder={ct.password} value={loginForm.password} onChange={e => setLoginForm({ ...loginForm, password: e.target.value })} className="w-full px-6 py-4 text-lg rounded-[25px] border-2 border-white/60 bg-white/50 focus:bg-white focus:border-blue-400 outline-none transition-all shadow-sm" />
                  </div>
                  <div className="pt-4 space-y-4">
                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-4 rounded-[30px] shadow-[0_10px_20px_-10px_rgba(37,99,235,0.5)] transition-all text-xl">{ct.loginSecurely}</button>
                    <button type="button" onClick={() => navigateTo('register')} className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-4 rounded-[30px] shadow-lg transition-all text-lg">{ct.registerNew}</button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}

          {/* â”€â”€ REGISTER STEP 1 â”€â”€ */}
          {view === 'register' && (
            <motion.div key="reg1" variants={pageVariants} initial="initial" animate="in" exit="out" transition={{ duration: 0.5 }} className="w-full max-w-lg mx-auto">
              <div className={glassCard}>
                {renderModuleHeader(ct.createAccount)}
                <p className="text-slate-500 font-medium mb-6 px-1">{ct.step1}</p>
                <form className="space-y-5" onSubmit={handleRegisterStep1}>
                  {/* Role Selector */}
                  <div className="mb-2 p-1 bg-white/50 backdrop-blur-sm rounded-2xl flex border border-white/60 shadow-inner">
                    {['user', 'admin'].map(r => (
                      <button type="button" key={r} onClick={() => setFormData({ ...formData, role: r })}
                        className={`flex-1 py-3 px-4 rounded-[15px] text-base font-bold transition-all ${formData.role === r
                          ? (r === 'admin' ? 'bg-slate-800 text-white shadow-sm' : 'bg-blue-600 text-white shadow-sm')
                          : 'text-slate-500 hover:text-slate-700'}`}>
                        {r === 'user' ? <><HiOutlineUserCircle className="inline w-5 h-5 mr-1 align-text-bottom"/> {ct.userRole}</> : <><HiShieldCheck className="inline w-5 h-5 mr-1 align-text-bottom"/> {ct.adminRole}</>}
                      </button>
                    ))}
                  </div>
                  {formData.role === 'admin' && (
                    <div className="px-4 py-3 bg-amber-50 border border-amber-200 rounded-2xl text-amber-700 text-sm font-semibold">
                      <HiExclamationTriangle className="inline w-5 h-5 mr-1 align-text-bottom text-amber-600" /> Admin accounts require additional approval. Your account will be reviewed before activation.
                    </div>
                  )}
                  <div>
                    <label className="flex items-center text-sm font-bold text-slate-600 mb-1 ml-2 cursor-pointer" onClick={() => speak(ai.fullName, lc)}>
                      {ct.fullName} <SpeakBtn text={ai.fullName} lc={lc} />
                    </label>
                    <input required placeholder={ct.fullName} value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full px-6 py-4 text-lg rounded-[25px] border-2 border-white/60 bg-white/50 focus:bg-white focus:border-blue-400 outline-none shadow-sm" />
                  </div>
                  <div>
                    <label className="flex items-center text-sm font-bold text-slate-600 mb-1 ml-2 cursor-pointer" onClick={() => speak(ai.phone, lc)}>
                      {ct.phone1} <SpeakBtn text={ai.phone} lc={lc} />
                    </label>
                    <input required type="tel" placeholder={ct.phone1} value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="w-full px-6 py-4 text-lg rounded-[25px] border-2 border-white/60 bg-white/50 focus:bg-white focus:border-blue-400 outline-none shadow-sm" />
                  </div>
                  <div>
                    <label className="flex items-center text-sm font-bold text-slate-600 mb-1 ml-2 cursor-pointer" onClick={() => speak(ai.email, lc)}>
                      {ct.email2} <SpeakBtn text={ai.email} lc={lc} />
                    </label>
                    <input required type="email" placeholder={ct.email2} value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full px-6 py-4 text-lg rounded-[25px] border-2 border-white/60 bg-white/50 focus:bg-white focus:border-blue-400 outline-none shadow-sm" />
                  </div>
                  <div>
                    <label className="flex items-center text-sm font-bold text-slate-600 mb-1 ml-2 cursor-pointer" onClick={() => speak(ai.password, lc)}>
                      {ct.password} <SpeakBtn text={ai.password} lc={lc} />
                    </label>
                    <input required type="password" placeholder={ct.password} value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} className="w-full px-6 py-4 text-lg rounded-[25px] border-2 border-white/60 bg-white/50 focus:bg-white focus:border-blue-400 outline-none shadow-sm" />
                  </div>
                  <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-5 rounded-[30px] shadow-lg transition-all text-xl mt-4">{ct.sendOtp}</button>
                </form>
              </div>
            </motion.div>
          )}

          {/* â”€â”€ OTP VERIFY â”€â”€ */}
          {/* â”€â”€ EMAIL PENDING (NOW EMAIL OTP) â”€â”€ */}
          {view === 'registerPending' && (
            <motion.div key="reg3" variants={pageVariants} initial="initial" animate="in" exit="out" transition={{ duration: 0.5 }} className="w-full max-w-md mx-auto">
              <div className={`${glassCard} text-center`}>
                {renderModuleHeader(ct.checkEmail)}
                <div className="w-24 h-24 bg-blue-100/80 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner border-4 border-white">
                  <HiShieldCheck className="w-12 h-12 text-blue-600" />
                </div>
                <h2 className="text-2xl font-black text-slate-800 mb-2">Final Email Verification</h2>
                <p className="text-slate-600 font-medium mb-6">
                  {ct.emailSent} <strong>{formData.email}</strong>. Enter the 6-digit Email OTP below.
                </p>

                <form onSubmit={handleVerifyEmailOTP}>
                  <input required type="text" maxLength="6" value={formData.emailOtp || ''} onChange={e => setFormData({ ...formData, emailOtp: e.target.value })} className="w-full text-center tracking-[0.5em] px-6 py-6 text-4xl font-black rounded-[25px] border-2 border-white/80 bg-white/70 focus:bg-white focus:border-blue-500 outline-none shadow-inner mb-6 text-slate-800" placeholder="â€¢â€¢â€¢â€¢â€¢â€¢" />
                  <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-4 rounded-[30px] shadow-lg transition-all text-xl">Verify Email OTP</button>
                </form>

                {/* Dev fallback â€” Gmail not configured yet */}
                {formData.devVerifyLink && (
                  <div className="mt-6 text-left bg-amber-50 border border-amber-200 rounded-2xl p-4">
                    <p className="text-sm font-bold text-amber-700 mb-2">âš  Dev Mode (Gmail not configured)</p>
                    <p className="text-xs break-words">Your Email OTP is: {formData.devVerifyLink}</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* ── USER DASHBOARD ── */}
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
                        <span className={`ml-4 px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap ${
                          c.status === 'Resolved' ? 'bg-green-100 text-green-700' :
                          c.status === 'Verified' ? 'bg-blue-100 text-blue-700' :
                          c.status === 'Unreviewed' ? 'bg-slate-100 text-slate-600' :
                          'bg-amber-100 text-amber-700'
                        }`}>{c.status || 'Pending'}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}


          {/* â”€â”€ COMPLAINT FORM â”€â”€ */}
          {view === 'complaintForm' && (
            <motion.div key="complaintForm" variants={pageVariants} initial="initial" animate="in" exit="out" className="w-full max-w-2xl mx-auto">
              <div className={glassCard}>
                {renderModuleHeader(ct.submitTitle)}
                <form className="space-y-6" onSubmit={handleIssueSubmit}>
                  <div>
                    <label className="flex items-center text-sm font-bold text-slate-700 mb-2 ml-2 uppercase tracking-wide cursor-pointer" onClick={() => speak(ai.title, lc)}>
                      {ct.titleLabel} <SpeakBtn text={ai.title} lc={lc} />
                    </label>
                    <input required value={issueForm.title} onChange={e => setIssueForm({ ...issueForm, title: e.target.value })} className="w-full px-6 py-4 text-lg rounded-[25px] border-2 border-white/60 bg-white/50 focus:bg-white focus:border-blue-400 outline-none shadow-sm" />
                  </div>
                  <div>
                    <label className="flex items-center text-sm font-bold text-slate-700 mb-2 ml-2 uppercase tracking-wide cursor-pointer" onClick={() => speak(ai.category, lc)}>
                      {ct.catLabel} <SpeakBtn text={ai.category} lc={lc} />
                    </label>
                    <select required value={issueForm.category} onChange={e => setIssueForm({ ...issueForm, category: e.target.value })} className="w-full px-6 py-4 text-lg rounded-[25px] border-2 border-white/60 bg-white/50 focus:bg-white focus:border-blue-400 outline-none shadow-sm">
                      {ct.categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="flex items-center text-sm font-bold text-slate-700 mb-2 ml-2 uppercase tracking-wide cursor-pointer" onClick={() => speak(ai.description, lc)}>
                      {ct.descLabel} <SpeakBtn text={ai.description} lc={lc} />
                    </label>
                    <textarea required rows={4} value={issueForm.description} onChange={e => setIssueForm({ ...issueForm, description: e.target.value })} className="w-full px-6 py-4 text-lg rounded-[25px] border-2 border-white/60 bg-white/50 focus:bg-white focus:border-blue-400 outline-none shadow-sm"></textarea>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button type="button" onClick={handleGetLocation} className={`flex items-center justify-center p-4 rounded-[25px] border-2 font-bold transition-all ${issueForm.lat ? 'bg-green-100 border-green-300 text-green-700' : 'bg-white/50 border-white/60 text-slate-600 hover:bg-white/80'}`}>
                      <HiOutlineMapPin className="w-6 h-6 mr-2" /> {issueForm.lat ? ct.locGot : ct.locBtn}
                      <SpeakBtn text={ai.location} lc={lc} />
                    </button>
                    <button type="button" onClick={handleAudioRecording} className={`flex items-center justify-center p-4 rounded-[25px] border-2 font-bold transition-all ${isRecording ? 'bg-red-100 text-red-600 border-red-300 animate-pulse' : (audioBlob ? 'bg-blue-100 text-blue-600 border-blue-300' : 'bg-white/50 border-white/60 text-slate-600 hover:bg-white/80')}`}>
                      <HiOutlineMicrophone className="w-6 h-6 mr-2" /> {isRecording ? "Recording..." : (audioBlob ? ct.audioRecorded : ct.audioLabel)}
                      <SpeakBtn text={ai.audioRec} lc={lc} />
                    </button>
                  </div>

                  <div>
                    <label className="flex items-center text-sm font-bold text-slate-700 mb-2 ml-2 uppercase tracking-wide cursor-pointer" onClick={() => speak(ai.evidence, lc)}>
                      {ct.evidenceLabel} <SpeakBtn text={ai.evidence} lc={lc} />
                    </label>
                    <input type="file" accept="image/*,video/*,document/*" onChange={handleFileChange} className="w-full px-4 py-3 bg-white/50 border-2 border-white/60 rounded-[25px]" />
                  </div>

                  <div className="flex items-center mb-4 pl-2 mt-4">
                    <input type="checkbox" id="anon" checked={issueForm.isAnonymous} onChange={e => setIssueForm({ ...issueForm, isAnonymous: e.target.checked })} className="w-5 h-5 rounded" />
                    <label htmlFor="anon" className="ml-3 font-semibold text-slate-700 cursor-pointer" onClick={() => speak(ai.anonymous, lc)}>
                      {ct.anonymousLabel}
                    </label>
                    <SpeakBtn text={ai.anonymous} lc={lc} />
                  </div>
                  <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-5 rounded-[30px] shadow-lg transition-all text-xl mt-4">{ct.submitBtn}</button>
                </form>
              </div>
            </motion.div>
          )}

          {/* â”€â”€ ADMIN DASHBOARD â”€â”€ */}
          {view === 'adminDashboard' && (
            <motion.div key="dash" variants={pageVariants} initial="initial" animate="in" exit="out" className="w-full max-w-6xl mx-auto">
              <div className={glassCard}>
                {renderModuleHeader(ct.dashTitle)}
                {complaints.length === 0 ? (
                  <p className="text-center text-slate-500 py-10 font-medium text-lg">{ct.noIssues}</p>
                ) : (
                  <div className="space-y-4">
                    {complaints.map(issue => {
                      const isSerious = issue.category === 'Violence' || issue.category === 'Harassment';
                      return (
                        <div key={issue._id} className={`rounded-[25px] p-1 shadow-sm transition-all overflow-hidden ${isSerious ? 'bg-red-500 p-[2px]' : 'bg-white/60 border border-white/80'}`}>
                          {isSerious && (
                            <div className="animate-pulse bg-red-600 text-white text-center font-bold text-xs py-1.5 uppercase tracking-widest flex items-center justify-center rounded-t-[20px]">
                              <HiExclamationTriangle className="w-4 h-4 mr-2" /> HIGH PRIORITY COMPLAINT DETECTED
                            </div>
                          )}
                          <div className="bg-white/90 p-6 rounded-[22px] flex flex-col">
                            <div className="flex justify-between items-center cursor-pointer" onClick={() => setExpandedId(expandedId === issue._id ? null : issue._id)}>
                              <div>
                                <h3 className="text-xl font-bold text-slate-800">{issue.title}</h3>
                                <p className="text-sm font-semibold text-blue-600 mt-1 uppercase tracking-wide">{issue.category} â€¢ ID: {issue.complaintId}</p>
                              </div>
                              <button className="p-3 bg-slate-100 text-slate-600 rounded-full hover:bg-blue-100 hover:text-blue-600 transition-colors">
                                {expandedId === issue._id ? <HiChevronUp className="w-6 h-6" /> : <HiChevronDown className="w-6 h-6" />}
                              </button>
                            </div>
                            <AnimatePresence>
                              {expandedId === issue._id && (
                                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="pt-6 mt-4 border-t border-slate-200">
                                  <p className="text-slate-600 text-lg leading-relaxed mb-4">{issue.description}</p>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                      <h4 className="font-bold text-sm text-slate-400 uppercase mb-2">Evidence Files</h4>
                                      {issue.evidenceFiles?.length > 0 ? (
                                        <ul className="list-disc pl-5">
                                          {issue.evidenceFiles.map((ev, i) => <li key={i}><a href={`http://localhost:5000/${ev}`} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">{ev.replace('uploads\\', '')}</a></li>)}
                                        </ul>
                                      ) : <p className="text-sm text-slate-500">No extra evidence uploaded.</p>}
                                      {issue.audioEvidence && <div className="mt-2 text-blue-600 underline font-semibold"><a href={`http://localhost:5000/${issue.audioEvidence}`} target="_blank" rel="noreferrer">Download Audio Evidence</a></div>}
                                    </div>
                                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col justify-center">
                                      <div className={`text-lg font-bold mb-2 flex items-center ${issue.evidenceStatus === 'Suspicious' ? 'text-red-600' : (issue.evidenceStatus === 'Verified' ? 'text-green-600' : 'text-amber-500')}`}>
                                        Evidence Status: {issue.evidenceStatus || 'Needs Review'}
                                      </div>
                                      <div className="text-sm text-slate-500 font-semibold mb-2">Submitted By: {issue.userId ? issue.userId.name : 'Anonymous User'}</div>
                                      <div className="text-sm text-slate-500 font-semibold mb-2 flex items-center">
                                        <HiOutlineMapPin className="w-4 h-4 mr-1" />
                                        {issue.location?.lat ? `${issue.location.lat}, ${issue.location.lng}` : 'Not Available'}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex flex-wrap gap-4 text-sm font-bold text-slate-500 bg-slate-50 p-4 rounded-xl">
                                      <div className="flex flex-wrap gap-2 mt-3">
                                        {['Pending','Verified','Unreviewed','Resolved'].map(s => (
                                          <button key={s} onClick={() => handleUpdateStatus(issue._id, s)}
                                            className={`px-3 py-1 rounded-full text-xs font-bold border-2 transition-all ${
                                              issue.status === s
                                                ? 'bg-blue-600 text-white border-blue-600'
                                                : 'bg-white/70 text-slate-600 border-slate-200 hover:border-blue-400 hover:text-blue-600'
                                            }`}>{s}</button>
                                        ))}
                                      </div>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* â”€â”€ TRACKING â”€â”€ */}
          {view === 'tracking' && (
            <motion.div key="tracking" variants={pageVariants} initial="initial" animate="in" exit="out" className="w-full max-w-xl mx-auto">
              <div className={glassCard}>
                {renderModuleHeader(ct.trackTitle)}
                <div className="flex space-x-2 mb-4">
                  <input type="text" placeholder={ct.enterComplaintId} value={trackId} onChange={e => setTrackId(e.target.value)} className="flex-1 px-6 py-4 text-lg rounded-[25px] border-2 border-white/60 bg-white/50 focus:bg-white focus:border-blue-400 outline-none shadow-sm" />
                  <button onClick={() => trackComplaint()} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-[25px] shadow-sm">{ct.trackBtn}</button>
                </div>
                <div className="flex items-center mb-6 ml-2">
                  <label className="text-sm text-slate-500 font-semibold cursor-pointer flex items-center" onClick={() => speak(ai.trackId, lc)}>
                    {ct.enterComplaintId} <SpeakBtn text={ai.trackId} lc={lc} />
                  </label>
                </div>
                {trackedComplaint ? (
                  <div className="bg-white/80 p-6 rounded-[25px] border border-white/80 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-2 h-full bg-blue-500"></div>
                    <h3 className="text-xl font-bold text-slate-800 mb-1">{trackedComplaint.title}</h3>
                    <p className="text-sm text-slate-500 uppercase tracking-wide font-bold mb-4">{trackedComplaint.category}</p>
                    <div className="bg-slate-50 p-4 rounded-xl mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-slate-500 font-semibold">Status</span>
                        <span className="bg-blue-100 text-blue-700 font-bold px-3 py-1 rounded-full text-sm">{trackedComplaint.status}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500 font-semibold">Evidence Verification</span>
                        <span className={`font-bold px-3 py-1 rounded-full text-sm ${trackedComplaint.evidenceStatus === 'Verified' ? 'bg-green-100 text-green-700' : (trackedComplaint.evidenceStatus === 'Suspicious' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700')}`}>{trackedComplaint.evidenceStatus || 'Needs Review'}</span>
                      </div>
                    </div>
                    <p className="text-slate-600 mb-2">{trackedComplaint.description}</p>
                  </div>
                ) : (
                  <p className="text-center text-slate-500 font-medium">{trackId ? "Complaint not found. Verify ID." : "Enter your standard CD-YYYY-XXXXX format ID to track."}</p>
                )}
              </div>
            </motion.div>
          )}

          {/* â”€â”€ HELP â”€â”€ */}
          {view === 'help' && (
            <motion.div key="help" variants={pageVariants} initial="initial" animate="in" exit="out" className="w-full max-w-2xl mx-auto">
              <div className={`${glassCard} text-center`}>
                {renderModuleHeader(ct.demoTitle)}
                <p className="text-slate-600 font-medium mb-8 text-lg">Watch below to learn how to register, login, and submit a complaint using Complaint Desk.</p>
                <div className="w-full aspect-video bg-black rounded-[25px] flex items-center justify-center border-4 border-white shadow-xl mb-8 relative group overflow-hidden">
                  <video 
                    src="/videos/help-guide.mp4" 
                    controls 
                    className="w-full h-full object-cover"
                    poster="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1200"
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>
    </div>
  );
}


