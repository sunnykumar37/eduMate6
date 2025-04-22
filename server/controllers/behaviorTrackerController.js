const BehaviorTracker = require('../models/BehaviorTracker');

// @desc    Get all behavior records
// @route   GET /api/teacher-tools/behavior-tracker
// @access  Private
exports.getBehaviorRecords = async (req, res) => {
  try {
    const behaviorRecords = await BehaviorTracker.find().sort({ date: -1 });
    res.status(200).json(behaviorRecords);
  } catch (error) {
    console.error('Error fetching behavior records:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single behavior record
// @route   GET /api/teacher-tools/behavior-tracker/:id
// @access  Private
exports.getBehaviorRecordById = async (req, res) => {
  try {
    const behaviorRecord = await BehaviorTracker.findById(req.params.id);
    
    if (!behaviorRecord) {
      return res.status(404).json({ message: 'Behavior record not found' });
    }
    
    res.status(200).json(behaviorRecord);
  } catch (error) {
    console.error('Error fetching behavior record:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create new behavior record
// @route   POST /api/teacher-tools/behavior-tracker
// @access  Private
exports.createBehaviorRecord = async (req, res) => {
  try {
    const behaviorRecord = await BehaviorTracker.create(req.body);
    res.status(201).json(behaviorRecord);
  } catch (error) {
    console.error('Error creating behavior record:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update behavior record
// @route   PUT /api/teacher-tools/behavior-tracker/:id
// @access  Private
exports.updateBehaviorRecord = async (req, res) => {
  try {
    const behaviorRecord = await BehaviorTracker.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!behaviorRecord) {
      return res.status(404).json({ message: 'Behavior record not found' });
    }
    
    res.status(200).json(behaviorRecord);
  } catch (error) {
    console.error('Error updating behavior record:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete behavior record
// @route   DELETE /api/teacher-tools/behavior-tracker/:id
// @access  Private
exports.deleteBehaviorRecord = async (req, res) => {
  try {
    const behaviorRecord = await BehaviorTracker.findByIdAndDelete(req.params.id);
    
    if (!behaviorRecord) {
      return res.status(404).json({ message: 'Behavior record not found' });
    }
    
    res.status(200).json({ id: req.params.id });
  } catch (error) {
    console.error('Error deleting behavior record:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Search behavior records
// @route   GET /api/teacher-tools/behavior-tracker/search
// @access  Private
exports.searchBehaviorRecords = async (req, res) => {
  try {
    const { 
      studentName, 
      startDate, 
      endDate, 
      behaviorType, 
      category,
      followUpNeeded 
    } = req.query;
    
    // Build search criteria
    const searchCriteria = {};
    
    if (studentName) {
      searchCriteria.studentName = { $regex: studentName, $options: 'i' };
    }
    
    if (startDate || endDate) {
      searchCriteria.date = {};
      if (startDate) {
        searchCriteria.date.$gte = new Date(startDate);
      }
      if (endDate) {
        searchCriteria.date.$lte = new Date(endDate);
      }
    }
    
    if (behaviorType) {
      searchCriteria.behaviorType = behaviorType;
    }
    
    if (category) {
      searchCriteria.category = category;
    }
    
    if (followUpNeeded !== undefined) {
      searchCriteria.followUpNeeded = followUpNeeded === 'true';
    }
    
    const behaviorRecords = await BehaviorTracker.find(searchCriteria).sort({ date: -1 });
    
    res.status(200).json(behaviorRecords);
  } catch (error) {
    console.error('Error searching behavior records:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get behavior summary by student
// @route   GET /api/teacher-tools/behavior-tracker/summary/student/:studentName
// @access  Private
exports.getStudentBehaviorSummary = async (req, res) => {
  try {
    const { studentName } = req.params;
    
    // Get counts by behavior type
    const typeCounts = await BehaviorTracker.aggregate([
      { $match: { studentName: { $regex: studentName, $options: 'i' } } },
      { $group: { 
          _id: '$behaviorType', 
          count: { $sum: 1 } 
        } 
      }
    ]);
    
    // Get counts by category
    const categoryCounts = await BehaviorTracker.aggregate([
      { $match: { studentName: { $regex: studentName, $options: 'i' } } },
      { $group: { 
          _id: '$category', 
          count: { $sum: 1 } 
        } 
      }
    ]);
    
    // Get recent records
    const recentRecords = await BehaviorTracker.find({ 
      studentName: { $regex: studentName, $options: 'i' } 
    })
    .sort({ date: -1 })
    .limit(5);
    
    res.status(200).json({
      typeCounts,
      categoryCounts,
      recentRecords
    });
    
  } catch (error) {
    console.error('Error getting student behavior summary:', error);
    res.status(500).json({ message: 'Server error' });
  }
}; 