const express = require('express');
const router = express.Router();
const {
  getRemediationPlans,
  getRemediationPlanById,
  createRemediationPlan,
  updateRemediationPlan,
  deleteRemediationPlan,
  searchRemediationPlans
} = require('../../controllers/remediationPlanController');
// Middleware for authentication would be imported here
// const { protect } = require('../../middleware/authMiddleware');

// GET all remediation plans and POST new remediation plan
router.route('/')
  .get(getRemediationPlans)
  .post(createRemediationPlan);

// Search remediation plans
router.get('/search', searchRemediationPlans);

// GET, PUT, DELETE specific remediation plan
router.route('/:id')
  .get(getRemediationPlanById)
  .put(updateRemediationPlan)
  .delete(deleteRemediationPlan);

// POST add progress note to remediation plan
router.post('/:id/progress-note', remediationPlanController.addProgressNote);

// POST generate remediation plan suggestions
router.post('/generate-suggestions', remediationPlanController.generateSuggestions);

module.exports = router; 