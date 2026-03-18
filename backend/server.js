const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const multer = require('multer');
const path = require('path');
const otpRoutes = require('./routes/otpRoutes');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/otp', otpRoutes);

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/complaint_desk';
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB Connected to Complaint Desk DB'))
  .catch(err => console.log('MongoDB Connection Error:', err));

const User = require('./models/User');
const Complaint = require('./models/Complaint');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// API
app.post('/api/auth/register-step1', async (req, res) => {
  try {
    const { name, password, role } = req.body;
    const email = (req.body.email || '').trim().toLowerCase();
    const phone = (req.body.phone || '').trim();

    // Validate phone number
    if (!/^[6-9]\d{9}$/.test(phone)) {
      return res.status(400).json({ success: false, error: 'Phone number must be exactly 10 digits and start with 6, 7, 8, or 9' });
    }

    const existingUser = await User.findOne({ $or: [{ phone }, { email }] });
    if (existingUser) {
      if (existingUser.registrationStatus === 'Success') {
        return res.status(400).json({ success: false, error: 'User already exists with this phone or email' });
      }
      // If user is in Pending state (incomplete registration), delete and let them re-register
      await User.deleteOne({ _id: existingUser._id });
      console.log('Deleted incomplete registration for:', email);
    }
    
    const emailOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const phoneOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const roleToSet = (role === 'admin') ? 'admin' : 'user';
    
    global.pendingUsers = global.pendingUsers || {};
    global.pendingUsers[phone] = {
      name, phone, email, password, role: roleToSet, emailOtp, phoneOtp, createdAt: Date.now()
    };
    
    console.log('--- SMS SIMULATION ---');
    console.log('Sending SMS to: ' + phone);
    console.log('Message: Your Complaint Desk OTP is: ' + phoneOtp);
    console.log('----------------------');

    if (process.env.GMAIL_USER && process.env.GMAIL_USER !== 'your_gmail@gmail.com') {
      try {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD }
        });
        const mailOptions = {
          from: '"Complaint Desk" <' + process.env.GMAIL_USER + '>',
          to: email,
          subject: 'Your Account Verification OTP',
          html: `<div style="font-family: Arial, sans-serif; padding: 20px;"><h2>Welcome to Complaint Desk</h2><p>Your 6-digit Email verification code is: <strong style="font-size: 24px; color: #1e40af;">${emailOtp}</strong></p><p>Please enter this code on the registration page to verify your account.</p></div>`
        };
        await transporter.sendMail(mailOptions);
        console.log('OTP Email sent to: ' + email);
      } catch (err) {
        console.error('Failed to send OTP email:', err.message);
        return res.status(500).json({ success: false, error: 'Failed to send OTP to email.' });
      }
    } else {
       console.log('OTP Email generated (no email config):', emailOtp);
    }

    res.json({ success: true, message: 'OTP sent to your email' });
  } catch (error) { res.status(500).json({ success: false, error: error.message }); }
});

app.post('/api/auth/verify-email-otp', async (req, res) => {
  try {
    const phone = String(req.body.phone || '').trim();
    const emailOtp = req.body.emailOtp;
    global.pendingUsers = global.pendingUsers || {};
    const pendingUser = global.pendingUsers[phone];
    console.log('Available pending user keys:', Object.keys(global.pendingUsers));

    const cleanSubmittedOtp = String(emailOtp || '').trim();
    const cleanStoredOtp = String(pendingUser ? pendingUser.emailOtp || '' : '').trim();
    console.log('--- OTP DEBUG ---');
    console.log('Phone lookup key:', JSON.stringify(phone));
    console.log('pendingUser found:', !!pendingUser);
    console.log('Stored OTP:', cleanStoredOtp);
    console.log('Submitted OTP:', cleanSubmittedOtp);
    console.log('Match:', cleanStoredOtp === cleanSubmittedOtp);
    console.log('-----------------');
    if (!pendingUser || cleanStoredOtp !== cleanSubmittedOtp) {
      return res.status(400).json({ success: false, error: 'Invalid or Expired Email OTP' });
    }

    let user = await User.findOne({ phone });
    if (!user) {
      user = new User({
        name: pendingUser.name,
        phone: pendingUser.phone,
        email: pendingUser.email,
        password: pendingUser.password,
        role: pendingUser.role
      });
    }
    
    user.isEmailVerified = true; 
    user.isPhoneVerified = true; 
    user.registrationStatus = 'Success'; 
    user.verificationToken = null; 
    user.otp = null;
    await user.save();
    
    delete global.pendingUsers[phone];
    res.json({ success: true, message: 'Account verified successfully!', user });
  } catch (error) { res.status(500).json({ success: false, error: error.message }); }
});


app.post('/api/auth/login', async (req, res) => {
  try {
    const { password, role } = req.body;
    const identifier = (req.body.identifier || '').trim().toLowerCase();
    // Step 1: Find the user by email OR phone only (not password in query)
    const user = await User.findOne({ $or: [{ email: identifier }, { phone: identifier.replace(/^\+91/, '') }] });
    console.log('LOGIN DEBUG - identifier:', identifier, '| found user:', user ? user.email : 'null', '| status:', user ? user.registrationStatus : 'N/A');
    if (!user) return res.status(400).json({ success: false, error: 'No account found with this email or phone' });
    // Step 2: Check password separately
    if (user.password !== password) return res.status(400).json({ success: false, error: 'Incorrect password' });
    if (user.registrationStatus !== 'Success') return res.status(400).json({ success: false, error: 'Account not yet verified. Please complete OTP verification.' });
    if (role === 'admin' && user.role !== 'admin') return res.status(403).json({ success: false, error: 'Access Denied. Not an admin.' });
    if (role === 'user' && user.role === 'admin') return res.status(403).json({ success: false, error: 'Admin must login using Admin tab.' });
    res.json({ success: true, user });
  } catch (error) { res.status(500).json({ success: false, error: error.message }); }
});

app.post('/api/complaints', upload.fields([{ name: 'evidenceFile' }, { name: 'audioEvidence' }]), async (req, res) => {
  try {
    const data = req.body;
    let location = null;
    if (data.lat && data.lng) location = { lat: parseFloat(data.lat), lng: parseFloat(data.lng) };
    
    let evidenceFiles = [];
    if (req.files && req.files['evidenceFile']) evidenceFiles = req.files['evidenceFile'].map(f => f.path);
    let audioPath = null;
    if (req.files && req.files['audioEvidence']) audioPath = req.files['audioEvidence'][0].path;

    // AI Mock Logic
    let evidenceStatus = 'Verified';
    if (evidenceFiles.length > 0) {
      if (evidenceFiles[0].endsWith('.exe')) evidenceStatus = 'Suspicious';
      if (req.files['evidenceFile'][0].size > 5000000) evidenceStatus = 'Needs Review';
    }

    const complaintId = 'CD-2026-' + Math.floor(100000 + Math.random() * 900000);

    const newComplaint = new Complaint({
      complaintId,
      title: data.title, category: data.category, description: data.description,
      location, evidenceFiles, audioEvidence: audioPath,
      userId: data.isAnonymous === 'true' ? null : (data.userId || null),
      isAnonymous: data.isAnonymous === 'true',
      evidenceStatus
    });

    await newComplaint.save();
    res.json({ success: true, data: { complaintId: newComplaint.complaintId } });
  } catch (error) { res.status(500).json({ success: false, error: error.message }); }
});


app.get('/api/complaints', async (req, res) => {
  try {
    const complaints = await Complaint.find().populate('userId', 'name email').sort({ createdAt: -1 });
    res.json({ success: true, data: complaints });
  } catch (error) { res.status(500).json({ success: false, error: error.message }); }
});

app.get('/api/complaints/track/:id', async (req, res) => {
  try {
    const complaint = await Complaint.findOne({ complaintId: req.params.id });
    if (!complaint) return res.status(404).json({ success: false, error: 'Not found' });
    res.json({ success: true, data: complaint });
  } catch (error) { res.status(500).json({ success: false, error: error.message }); }
});


app.patch('/api/complaints/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Pending', 'Verified', 'Unreviewed', 'Resolved'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid status value' });
    }
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!complaint) return res.status(404).json({ success: false, error: 'Complaint not found' });
    res.json({ success: true, data: complaint });
  } catch (error) { res.status(500).json({ success: false, error: error.message }); }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log('Server running on port ' + PORT));

