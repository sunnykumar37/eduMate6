const express = require('express');
const router = express.Router();
const assignmentController = require('../../controllers/teacher-tools/assignmentController');
// Middleware for authentication would be imported here
// const { protect } = require('../../middleware/authMiddleware');

// GET all assignments
router.get('/', assignmentController.getAllAssignments);

// GET assignment by ID
router.get('/:id', assignmentController.getAssignmentById);

// POST create new assignment
router.post('/', assignmentController.createAssignment); // would add protect middleware in real app

// PUT update assignment
router.put('/:id', assignmentController.updateAssignment); // would add protect middleware in real app

// DELETE assignment
router.delete('/:id', assignmentController.deleteAssignment); // would add protect middleware in real app

// GET search assignments
router.get('/search/criteria', assignmentController.searchAssignments);

// POST generate rubric
router.post('/generate-rubric', assignmentController.generateRubric);

module.exports = router; 