const express = require('express');
const router = express.Router();
const studyMaterialController = require('../../controllers/teacher-tools/studyMaterialController');
// Middleware for authentication would be imported here
// const { protect } = require('../../middleware/authMiddleware');

// GET all study materials
router.get('/', studyMaterialController.getAllStudyMaterials);

// GET study material by ID
router.get('/:id', studyMaterialController.getStudyMaterialById);

// POST create new study material
router.post('/', studyMaterialController.createStudyMaterial); // would add protect middleware in real app

// PUT update study material
router.put('/:id', studyMaterialController.updateStudyMaterial); // would add protect middleware in real app

// DELETE study material
router.delete('/:id', studyMaterialController.deleteStudyMaterial); // would add protect middleware in real app

// GET search study materials
router.get('/search/criteria', studyMaterialController.searchStudyMaterials);

// POST generate differentiated versions
router.post('/differentiate/:materialId', studyMaterialController.generateDifferentiatedVersions);

module.exports = router; 