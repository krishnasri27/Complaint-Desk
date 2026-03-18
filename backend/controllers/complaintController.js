const Complaint = require('../models/Complaint');
const crypto = require('crypto');

const submitComplaint = async (req, res) => {
  try {
    const { title, category, description, location, anonymous } = req.body;
    const complaintId = 'CMP-' + crypto.randomBytes(4).toString('hex').toUpperCase();
    
    const evidenceFiles = req.files ? req.files.map(file => file.path) : [];
    
    const newComplaint = await Complaint.create({
      title, category, description, location: JSON.parse(location || '{}'),
      anonymous: anonymous === 'true',
      userId: anonymous === 'true' ? null : (req.user ? req.user.id : null),
      evidenceFiles,
      complaintId
    });
    
    res.status(201).json(newComplaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getComplaints = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    if (req.user && req.user.role !== 'admin') {
      filter.userId = req.user.id;
    }
    const complaints = await Complaint.find(filter).sort({ createdAt: -1 });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findOne({ complaintId: req.params.id });
    if (complaint) {
      res.json(complaint);
    } else {
      res.status(404).json({ message: 'Complaint not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { submitComplaint, getComplaints, getComplaintById };
