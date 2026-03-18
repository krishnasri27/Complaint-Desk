const fs = require('fs');
const filepath = 'src/App.jsx';
let lines = fs.readFileSync(filepath, 'utf8').split('\n');

// The clean translations strings
const cleanHindiScript = "नमस्ते! रजिस्ट्रेशन प्रक्रिया शुरू करने के लिए अपना नाम, फोन नंबर, ईमेल और OTP भरें। सबमिट करने के बाद अपनी ईमेल चेक करें। हमने वहां एक वेरिफिकेशन लिंक भेजा है। ध्यान दें: रजिस्ट्रेशन तभी पूरा होगा जब आप उस लिंक पर क्लिक करेंगे और आपका फोन नंबर सिस्टम से मैच होगा। हर पेज पर पीछे जाने के लिए 'Back' बटन का विकल्प दिया गया है।";

const cleanTranslations = `  hi: {
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
  }`;

// 1. Replace hindiAudioScript
const hindiStart = lines.findIndex(l => l.includes('const hindiAudioScript ='));
if (hindiStart > -1) {
  lines[hindiStart] = `const hindiAudioScript = "${cleanHindiScript}";`;
}

// 2. Locate hi: { ... te: { ... } } and replace them
let hiStart = -1, finalEnd = -1;
for(let i = 0; i < lines.length; i++) {
  if (lines[i].includes('hi: {')) hiStart = i;
  if (hiStart > -1 && i > hiStart && lines[i].includes('};') && lines[i-1].includes('}')) {
      finalEnd = i;
      break;
  }
}

// We need to carefully splice. The end is "  }\n};"
if (hiStart > -1 && finalEnd > -1) {
  lines.splice(hiStart, finalEnd - hiStart, cleanTranslations);
}

fs.writeFileSync(filepath, lines.join('\n'), 'utf8');
console.log('Language encoding fixed successfully.');
