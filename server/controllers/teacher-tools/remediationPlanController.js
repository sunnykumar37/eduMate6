const RemediationPlan = require('../../models/teacher-tools/RemediationPlan');
const Curriculum = require('../../models/teacher-tools/Curriculum');

// Get all remediation plans
exports.getAllRemediationPlans = async (req, res) => {
  try {
    const plans = await RemediationPlan.find()
      .sort({ createdAt: -1 })
      .populate('targetAreas.curriculumStandard', 'standardId subject gradeLevel');
      
    res.status(200).json(plans);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching remediation plans', error: error.message });
  }
};

// Get remediation plan by ID
exports.getRemediationPlanById = async (req, res) => {
  try {
    const plan = await RemediationPlan.findById(req.params.id)
      .populate('targetAreas.curriculumStandard', 'standardId subject gradeLevel description objectives');
      
    if (!plan) {
      return res.status(404).json({ message: 'Remediation plan not found' });
    }
    
    res.status(200).json(plan);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching remediation plan', error: error.message });
  }
};

// Create new remediation plan
exports.createRemediationPlan = async (req, res) => {
  try {
    const newPlan = new RemediationPlan({
      ...req.body,
      createdBy: req.user ? req.user.id : '64321a1a1234567890abcdef' // Temp dummy ID for testing
    });
    
    const savedPlan = await newPlan.save();
    
    const planWithPopulated = await RemediationPlan.findById(savedPlan._id)
      .populate('targetAreas.curriculumStandard', 'standardId subject gradeLevel');
      
    res.status(201).json(planWithPopulated);
  } catch (error) {
    res.status(400).json({ message: 'Error creating remediation plan', error: error.message });
  }
};

// Update remediation plan
exports.updateRemediationPlan = async (req, res) => {
  try {
    const updatedPlan = await RemediationPlan.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    ).populate('targetAreas.curriculumStandard', 'standardId subject gradeLevel');
    
    if (!updatedPlan) {
      return res.status(404).json({ message: 'Remediation plan not found' });
    }
    
    res.status(200).json(updatedPlan);
  } catch (error) {
    res.status(400).json({ message: 'Error updating remediation plan', error: error.message });
  }
};

// Delete remediation plan
exports.deleteRemediationPlan = async (req, res) => {
  try {
    const plan = await RemediationPlan.findByIdAndDelete(req.params.id);
    
    if (!plan) {
      return res.status(404).json({ message: 'Remediation plan not found' });
    }
    
    res.status(200).json({ message: 'Remediation plan deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting remediation plan', error: error.message });
  }
};

// Search remediation plans by criteria
exports.searchRemediationPlans = async (req, res) => {
  try {
    const { studentName, studentId, subject, gradeLevel, status } = req.query;
    const query = {};
    
    if (studentName) query.studentName = new RegExp(studentName, 'i');
    if (studentId) query.studentId = new RegExp(studentId, 'i');
    if (subject) query.subject = new RegExp(subject, 'i');
    if (gradeLevel) query.gradeLevel = new RegExp(gradeLevel, 'i');
    if (status) query['progress.status'] = status;
    
    const plans = await RemediationPlan.find(query)
      .sort({ createdAt: -1 })
      .populate('targetAreas.curriculumStandard', 'standardId subject gradeLevel');
      
    res.status(200).json(plans);
  } catch (error) {
    res.status(500).json({ message: 'Error searching remediation plans', error: error.message });
  }
};

// Add progress note to remediation plan
exports.addProgressNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { content, progressIndicator } = req.body;
    
    if (!content || !progressIndicator) {
      return res.status(400).json({ message: 'Content and progress indicator are required' });
    }
    
    const updatedPlan = await RemediationPlan.findByIdAndUpdate(
      id,
      { 
        $push: { 'progress.notes': { content, progressIndicator, date: Date.now() } },
        updatedAt: Date.now()
      },
      { new: true, runValidators: true }
    ).populate('targetAreas.curriculumStandard', 'standardId subject gradeLevel');
    
    if (!updatedPlan) {
      return res.status(404).json({ message: 'Remediation plan not found' });
    }
    
    res.status(200).json(updatedPlan);
  } catch (error) {
    res.status(400).json({ message: 'Error adding progress note', error: error.message });
  }
};

// Generate remediation plan suggestions based on curriculum standards
exports.generateSuggestions = async (req, res) => {
  try {
    const { subject, gradeLevel, areas } = req.body;
    
    if (!subject || !gradeLevel || !areas || !areas.length) {
      return res.status(400).json({ 
        message: 'Subject, grade level, and at least one area of concern are required' 
      });
    }
    
    // Find related curriculum standards
    let standards = [];
    try {
      standards = await Curriculum.find({
        subject: new RegExp(subject, 'i'),
        gradeLevel: new RegExp(gradeLevel, 'i')
      });
    } catch (err) {
      // Continue even if we can't find standards
      console.error('Failed to fetch curriculum standards:', err);
    }
    
    // Create target areas based on input areas
    const targetAreas = areas.map(area => {
      // Try to find a matching standard
      const matchingStandard = standards.find(std => 
        std.description.toLowerCase().includes(area.toLowerCase()) || 
        std.objectives.some(obj => obj.toLowerCase().includes(area.toLowerCase()))
      );
      
      return {
        area,
        description: `Improve skills in ${area}`,
        curriculumStandard: matchingStandard ? matchingStandard._id : null
      };
    });
    
    // Generate sample goals based on target areas
    const goals = targetAreas.map(targetArea => ({
      description: `Master concepts related to ${targetArea.area}`,
      successCriteria: `Student can demonstrate understanding of ${targetArea.area} through assessment with 80% accuracy`,
      targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
    }));
    
    // Generate sample activities based on target areas
    const activityTypes = ['practice', 'assessment', 'game', 'project', 'reading'];
    const activities = targetAreas.flatMap(targetArea => {
      return activityTypes.slice(0, 3).map((type, index) => ({
        title: `${type.charAt(0).toUpperCase() + type.slice(1)} activity for ${targetArea.area}`,
        description: `${type.charAt(0).toUpperCase() + type.slice(1)} activity to improve skills in ${targetArea.area}`,
        type,
        resources: [`Sample resource for ${targetArea.area}`]
      }));
    });
    
    // Create plan template
    const planTemplate = {
      targetAreas,
      goals,
      activities,
      progress: {
        status: 'not_started',
        notes: []
      }
    };
    
    res.status(200).json(planTemplate);
  } catch (error) {
    res.status(500).json({ message: 'Error generating remediation plan suggestions', error: error.message });
  }
}; 