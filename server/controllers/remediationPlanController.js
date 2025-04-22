const RemediationPlan = require('../models/RemediationPlan');

// @desc    Get all remediation plans
// @route   GET /api/teacher-tools/remediation-plans
// @access  Private
exports.getRemediationPlans = async (req, res) => {
  try {
    const remediationPlans = await RemediationPlan.find().sort({ createdAt: -1 });
    res.status(200).json(remediationPlans);
  } catch (error) {
    console.error('Error fetching remediation plans:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single remediation plan
// @route   GET /api/teacher-tools/remediation-plans/:id
// @access  Private
exports.getRemediationPlanById = async (req, res) => {
  try {
    const remediationPlan = await RemediationPlan.findById(req.params.id);
    
    if (!remediationPlan) {
      return res.status(404).json({ message: 'Remediation plan not found' });
    }
    
    res.status(200).json(remediationPlan);
  } catch (error) {
    console.error('Error fetching remediation plan:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create new remediation plan
// @route   POST /api/teacher-tools/remediation-plans
// @access  Private
exports.createRemediationPlan = async (req, res) => {
  try {
    const remediationPlan = await RemediationPlan.create(req.body);
    res.status(201).json(remediationPlan);
  } catch (error) {
    console.error('Error creating remediation plan:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update remediation plan
// @route   PUT /api/teacher-tools/remediation-plans/:id
// @access  Private
exports.updateRemediationPlan = async (req, res) => {
  try {
    const remediationPlan = await RemediationPlan.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!remediationPlan) {
      return res.status(404).json({ message: 'Remediation plan not found' });
    }
    
    res.status(200).json(remediationPlan);
  } catch (error) {
    console.error('Error updating remediation plan:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete remediation plan
// @route   DELETE /api/teacher-tools/remediation-plans/:id
// @access  Private
exports.deleteRemediationPlan = async (req, res) => {
  try {
    const remediationPlan = await RemediationPlan.findByIdAndDelete(req.params.id);
    
    if (!remediationPlan) {
      return res.status(404).json({ message: 'Remediation plan not found' });
    }
    
    res.status(200).json({ id: req.params.id });
  } catch (error) {
    console.error('Error deleting remediation plan:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Search remediation plans
// @route   GET /api/teacher-tools/remediation-plans/search
// @access  Private
exports.searchRemediationPlans = async (req, res) => {
  try {
    const { query, status, gradeLevel } = req.query;
    
    // Build search criteria
    const searchCriteria = {};
    
    if (query) {
      searchCriteria.$or = [
        { studentName: { $regex: query, $options: 'i' } },
        { subject: { $regex: query, $options: 'i' } },
        { goals: { $regex: query, $options: 'i' } }
      ];
    }
    
    if (status) {
      searchCriteria.status = status;
    }
    
    if (gradeLevel) {
      searchCriteria.gradeLevel = gradeLevel;
    }
    
    const remediationPlans = await RemediationPlan.find(searchCriteria).sort({ createdAt: -1 });
    
    res.status(200).json(remediationPlans);
  } catch (error) {
    console.error('Error searching remediation plans:', error);
    res.status(500).json({ message: 'Server error' });
  }
}; 