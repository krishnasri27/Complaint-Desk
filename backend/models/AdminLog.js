const mongoose = require("mongoose");

const adminLogSchema = new mongoose.Schema({
  complaintId: { type: mongoose.Schema.Types.ObjectId, ref: "Complaint", required: true },
  action: { type: String, required: true },
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true });

const AdminLog = mongoose.models.AdminLog || mongoose.model("AdminLog", adminLogSchema);

module.exports = AdminLog;
