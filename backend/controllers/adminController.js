const Complaint = require('../models/Complaint');
const AdminLog = require('../models/AdminLog');

const updateComplaintStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  try {
    const complaint = await Complaint.findOne({ complaintId: id });
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });
  
    const previousStatus = complaint.status;
    complaint.status = status;
    const updated = await complaint.save();
    
    // Log action
    await AdminLog.create({
      complaintId: complaint._id,
      action: "Status changed from  to ",
      adminId: req.user.id
    });
    
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getStats = async (req, res) => {
  try {
    const total = await Complaint.countDocuments();
    const pending = await Complaint.countDocuments({ status: 'Pending' });
    const resolved = await Complaint.countDocuments({ status: 'Resolved' });
    const rejected = await Complaint.countDocuments({ status: 'Rejected' });
    
    res.json({ total, pending, resolved, rejected });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { updateComplaintStatus, getStats };
