const express = require('express');
const router = express.Router();
const {
  getBehaviorRecords,
  getBehaviorRecordById,
  createBehaviorRecord,
  updateBehaviorRecord,
  deleteBehaviorRecord,
  searchBehaviorRecords,
  getStudentBehaviorSummary
} = require('../../controllers/behaviorTrackerController');
// Middleware for authentication would be imported here
// const { protect } = require('../../middleware/authMiddleware');

// GET all behavior records and POST new behavior record
router.route('/')
  .get(getBehaviorRecords)
  .post(createBehaviorRecord);

// Search behavior records
router.get('/search', searchBehaviorRecords);

// Get student behavior summary
router.get('/summary/student/:studentName', getStudentBehaviorSummary);

// GET, PUT, DELETE specific behavior record
router.route('/:id')
  .get(getBehaviorRecordById)
  .put(updateBehaviorRecord)
  .delete(deleteBehaviorRecord);

module.exports = router; 