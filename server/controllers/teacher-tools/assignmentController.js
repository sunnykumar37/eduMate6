const Assignment = require('../../models/teacher-tools/Assignment');
const Curriculum = require('../../models/teacher-tools/Curriculum');

// Get all assignments
exports.getAllAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find()
      .sort({ createdAt: -1 })
      .populate('curriculumStandards', 'standardId subject gradeLevel');
      
    res.status(200).json(assignments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching assignments', error: error.message });
  }
};

// Get assignment by ID
exports.getAssignmentById = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id)
      .populate('curriculumStandards', 'standardId subject gradeLevel description objectives');
      
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }
    
    res.status(200).json(assignment);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching assignment', error: error.message });
  }
};

// Create new assignment
exports.createAssignment = async (req, res) => {
  try {
    const newAssignment = new Assignment({
      ...req.body,
      createdBy: req.user ? req.user.id : '64321a1a1234567890abcdef' // Temp dummy ID for testing
    });
    
    const savedAssignment = await newAssignment.save();
    
    // Populate curriculum standards
    const assignmentWithCurriculum = await Assignment.findById(savedAssignment._id)
      .populate('curriculumStandards', 'standardId subject gradeLevel');
      
    res.status(201).json(assignmentWithCurriculum);
  } catch (error) {
    res.status(400).json({ message: 'Error creating assignment', error: error.message });
  }
};

// Update assignment
exports.updateAssignment = async (req, res) => {
  try {
    const updatedAssignment = await Assignment.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    ).populate('curriculumStandards', 'standardId subject gradeLevel');
    
    if (!updatedAssignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }
    
    res.status(200).json(updatedAssignment);
  } catch (error) {
    res.status(400).json({ message: 'Error updating assignment', error: error.message });
  }
};

// Delete assignment
exports.deleteAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findByIdAndDelete(req.params.id);
    
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }
    
    res.status(200).json({ message: 'Assignment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting assignment', error: error.message });
  }
};

// Search assignments by criteria
exports.searchAssignments = async (req, res) => {
  try {
    const { title, subject, gradeLevel, curriculumStandard } = req.query;
    const query = {};
    
    if (title) query.title = new RegExp(title, 'i');
    if (subject) query.subject = new RegExp(subject, 'i');
    if (gradeLevel) query.gradeLevel = new RegExp(gradeLevel, 'i');
    if (curriculumStandard) query.curriculumStandards = curriculumStandard;
    
    const assignments = await Assignment.find(query)
      .sort({ createdAt: -1 })
      .populate('curriculumStandards', 'standardId subject gradeLevel');
      
    res.status(200).json(assignments);
  } catch (error) {
    res.status(500).json({ message: 'Error searching assignments', error: error.message });
  }
};

// Generate a rubric based on assignment details
exports.generateRubric = async (req, res) => {
  try {
    const { title, description, pointsPossible, curriculumStandards } = req.body;
    
    if (!title || !description || !pointsPossible) {
      return res.status(400).json({ 
        message: 'Title, description, and points possible are required to generate a rubric' 
      });
    }
    
    // Default criteria if no curriculum standards provided
    let rubricCriteria = [
      {
        name: 'Content Quality',
        description: 'The quality and accuracy of the content',
        pointsPossible: Math.round(pointsPossible * 0.4),
        levels: [
          { score: 1, description: 'Poor content quality with many errors' },
          { score: 2, description: 'Basic content with some errors' },
          { score: 3, description: 'Good content with minor errors' },
          { score: 4, description: 'Excellent content with no errors' }
        ]
      },
      {
        name: 'Organization',
        description: 'The structure and organization of the work',
        pointsPossible: Math.round(pointsPossible * 0.3),
        levels: [
          { score: 1, description: 'Poorly organized and difficult to follow' },
          { score: 2, description: 'Basic organization with some logical flow' },
          { score: 3, description: 'Well organized with good flow' },
          { score: 4, description: 'Exceptionally well organized and easy to follow' }
        ]
      },
      {
        name: 'Presentation',
        description: 'The presentation and format of the work',
        pointsPossible: Math.round(pointsPossible * 0.3),
        levels: [
          { score: 1, description: 'Poor presentation with many formatting issues' },
          { score: 2, description: 'Basic presentation with some formatting issues' },
          { score: 3, description: 'Good presentation with minimal formatting issues' },
          { score: 4, description: 'Excellent presentation with no formatting issues' }
        ]
      }
    ];
    
    // If curriculum standards are provided, generate more specific criteria
    if (curriculumStandards && curriculumStandards.length > 0) {
      try {
        const standards = await Curriculum.find({ 
          _id: { $in: curriculumStandards } 
        });
        
        if (standards.length > 0) {
          rubricCriteria = [];
          let pointsPerStandard = Math.floor(pointsPossible / standards.length);
          
          standards.forEach(standard => {
            rubricCriteria.push({
              name: `Standard: ${standard.standardId}`,
              description: standard.description,
              pointsPossible: pointsPerStandard,
              levels: [
                { score: 1, description: `Does not meet the standard: ${standard.standardId}` },
                { score: 2, description: `Partially meets the standard: ${standard.standardId}` },
                { score: 3, description: `Meets the standard: ${standard.standardId}` },
                { score: 4, description: `Exceeds the standard: ${standard.standardId}` }
              ]
            });
          });
        }
      } catch (error) {
        console.error('Error fetching curriculum standards:', error);
        // If there's an error, use the default criteria
      }
    }
    
    res.status(200).json(rubricCriteria);
  } catch (error) {
    res.status(500).json({ message: 'Error generating rubric', error: error.message });
  }
}; 