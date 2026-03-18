const express = require('express');
const { updateComplaintStatus, getStats } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.put('/complaints/:id/status', protect, admin, updateComplaintStatus);
router.get('/stats', protect, admin, getStats);

module.exports = router;
