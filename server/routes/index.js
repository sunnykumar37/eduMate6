const express = require('express');
const router = express.Router();

// Import teacher tools routes
const curriculumRoutes = require('./teacher-tools/curriculumRoutes');
const assignmentRoutes = require('./teacher-tools/assignmentRoutes');
const studyMaterialRoutes = require('./teacher-tools/studyMaterialRoutes');
const remediationPlanRoutes = require('./teacher-tools/remediationPlanRoutes');
const behaviorTrackerRoutes = require('./teacher-tools/behaviorTrackerRoutes');

// Teacher Tools API routes
router.use('/teacher-tools/curriculum', curriculumRoutes);
router.use('/teacher-tools/assignments', assignmentRoutes);
router.use('/teacher-tools/study-materials', studyMaterialRoutes);
router.use('/teacher-tools/remediation-plans', remediationPlanRoutes);
router.use('/teacher-tools/behavior-tracker', behaviorTrackerRoutes);

// Future routes for other Teacher Tools features will be added here
// router.use('/teacher-tools/analytics', analyticsRoutes);

module.exports = router; 