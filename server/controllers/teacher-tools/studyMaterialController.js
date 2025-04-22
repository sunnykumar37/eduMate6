const StudyMaterial = require('../../models/teacher-tools/StudyMaterial');
const Curriculum = require('../../models/teacher-tools/Curriculum');

// Get all study materials
exports.getAllStudyMaterials = async (req, res) => {
  try {
    const materials = await StudyMaterial.find()
      .sort({ createdAt: -1 })
      .populate('curriculumStandards', 'standardId subject gradeLevel');
      
    res.status(200).json(materials);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching study materials', error: error.message });
  }
};

// Get study material by ID
exports.getStudyMaterialById = async (req, res) => {
  try {
    const material = await StudyMaterial.findById(req.params.id)
      .populate('curriculumStandards', 'standardId subject gradeLevel description objectives');
      
    if (!material) {
      return res.status(404).json({ message: 'Study material not found' });
    }
    
    res.status(200).json(material);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching study material', error: error.message });
  }
};

// Create new study material
exports.createStudyMaterial = async (req, res) => {
  try {
    const newMaterial = new StudyMaterial({
      ...req.body,
      createdBy: req.user ? req.user.id : '64321a1a1234567890abcdef' // Temp dummy ID for testing
    });
    
    const savedMaterial = await newMaterial.save();
    
    const materialWithCurriculum = await StudyMaterial.findById(savedMaterial._id)
      .populate('curriculumStandards', 'standardId subject gradeLevel');
      
    res.status(201).json(materialWithCurriculum);
  } catch (error) {
    res.status(400).json({ message: 'Error creating study material', error: error.message });
  }
};

// Update study material
exports.updateStudyMaterial = async (req, res) => {
  try {
    const updatedMaterial = await StudyMaterial.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    ).populate('curriculumStandards', 'standardId subject gradeLevel');
    
    if (!updatedMaterial) {
      return res.status(404).json({ message: 'Study material not found' });
    }
    
    res.status(200).json(updatedMaterial);
  } catch (error) {
    res.status(400).json({ message: 'Error updating study material', error: error.message });
  }
};

// Delete study material
exports.deleteStudyMaterial = async (req, res) => {
  try {
    const material = await StudyMaterial.findByIdAndDelete(req.params.id);
    
    if (!material) {
      return res.status(404).json({ message: 'Study material not found' });
    }
    
    res.status(200).json({ message: 'Study material deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting study material', error: error.message });
  }
};

// Search study materials by criteria
exports.searchStudyMaterials = async (req, res) => {
  try {
    const { title, subject, gradeLevel, topic, learningLevel } = req.query;
    const query = {};
    
    if (title) query.title = new RegExp(title, 'i');
    if (subject) query.subject = new RegExp(subject, 'i');
    if (gradeLevel) query.gradeLevel = new RegExp(gradeLevel, 'i');
    if (topic) query.topic = new RegExp(topic, 'i');
    if (learningLevel) query.learningLevel = learningLevel;
    
    const materials = await StudyMaterial.find(query)
      .sort({ createdAt: -1 })
      .populate('curriculumStandards', 'standardId subject gradeLevel');
      
    res.status(200).json(materials);
  } catch (error) {
    res.status(500).json({ message: 'Error searching study materials', error: error.message });
  }
};

// Generate differentiated versions
exports.generateDifferentiatedVersions = async (req, res) => {
  try {
    const { materialId } = req.params;
    const originalMaterial = await StudyMaterial.findById(materialId);
    
    if (!originalMaterial) {
      return res.status(404).json({ message: 'Study material not found' });
    }
    
    // Create templates for differentiated versions
    const basicVersion = {
      title: `${originalMaterial.title} (Basic)`,
      subject: originalMaterial.subject,
      gradeLevel: originalMaterial.gradeLevel,
      topic: originalMaterial.topic,
      learningLevel: 'basic',
      content: simplifyContent(originalMaterial.content),
      resources: originalMaterial.resources,
      activities: originalMaterial.activities.filter(act => 
        act.difficultyLevel === 'easy' || act.difficultyLevel === 'medium'
      ),
      curriculumStandards: originalMaterial.curriculumStandards,
      createdBy: originalMaterial.createdBy
    };
    
    const advancedVersion = {
      title: `${originalMaterial.title} (Advanced)`,
      subject: originalMaterial.subject,
      gradeLevel: originalMaterial.gradeLevel,
      topic: originalMaterial.topic,
      learningLevel: 'advanced',
      content: enrichContent(originalMaterial.content),
      resources: [...originalMaterial.resources, 'Additional advanced resources would be added here'],
      activities: originalMaterial.activities.filter(act => 
        act.difficultyLevel === 'medium' || act.difficultyLevel === 'hard'
      ),
      curriculumStandards: originalMaterial.curriculumStandards,
      createdBy: originalMaterial.createdBy
    };
    
    res.status(200).json({
      original: originalMaterial,
      basic: basicVersion,
      advanced: advancedVersion
    });
  } catch (error) {
    res.status(500).json({ message: 'Error generating differentiated versions', error: error.message });
  }
};

// Helper functions for content differentiation
function simplifyContent(content) {
  // In a real implementation, this would use NLP or education-specific algorithms
  // Here we're just doing a simple transformation for demonstration
  return `SIMPLIFIED VERSION:\n\n${content}\n\nThis version has been simplified for basic learning levels, with:
- Simplified vocabulary
- More step-by-step instructions
- Additional explanations of concepts
- Visual aids and examples`;
}

function enrichContent(content) {
  // Similarly, this is a placeholder for demonstration
  return `ADVANCED VERSION:\n\n${content}\n\nThis version has been enhanced for advanced learning levels, with:
- More complex vocabulary
- Additional challenging concepts
- Extended examples and applications
- Open-ended questions and scenarios
- Connections to other topics and subjects`;
} 