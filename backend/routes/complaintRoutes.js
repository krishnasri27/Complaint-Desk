const express = require('express');
const { submitComplaint, getComplaints, getComplaintById } = require('../controllers/complaintController');
const { protect } = require('../middleware/authMiddleware');
const multer = require('multer');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// Anonymous or logged in users can submit
router.post('/submit', protect, upload.array('evidence', 5), submitComplaint);
// Public submit to allow completely unregistered users if they choose anonymous mode
router.post('/submit-anon', upload.array('evidence', 5), submitComplaint);

router.get('/', protect, getComplaints);
router.get('/:id', getComplaintById);

module.exports = router;
