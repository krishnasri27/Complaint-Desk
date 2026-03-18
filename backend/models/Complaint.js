const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema({
  complaintId: { type: String, unique: true },
  title: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  evidenceFiles: [{ type: String }],
  audioEvidence: { type: String, default: null },
  location: { lat: { type: Number }, lng: { type: Number } },
  status: { type: String, default: 'Submitted' },
  evidenceStatus: { type: String, default: 'Needs Review' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  isAnonymous: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const Complaint = mongoose.models.Complaint || mongoose.model("Complaint", complaintSchema);

module.exports = Complaint;
