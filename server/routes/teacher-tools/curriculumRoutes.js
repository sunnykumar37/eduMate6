const express = require('express');
const router = express.Router();
const curriculumController = require('../../controllers/teacher-tools/curriculumController');
// Middleware for authentication would be imported here
// const { protect } = require('../../middleware/authMiddleware');

// GET all curriculum standards
router.get('/', curriculumController.getAllCurriculum);

// GET curriculum by ID
router.get('/:id', curriculumController.getCurriculumById);

// POST create new curriculum
router.post('/', curriculumController.createCurriculum); // would add protect middleware in real app

// PUT update curriculum
router.put('/:id', curriculumController.updateCurriculum); // would add protect middleware in real app

// DELETE curriculum
router.delete('/:id', curriculumController.deleteCurriculum); // would add protect middleware in real app

// GET search curriculum standards
router.get('/search/criteria', curriculumController.searchCurriculum);

// POST check alignment between content and curriculum standard
router.post('/check-alignment', curriculumController.checkAlignment);

module.exports = router; 