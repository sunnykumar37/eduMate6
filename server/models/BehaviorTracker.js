const mongoose = require('mongoose');

const BehaviorTrackerSchema = new mongoose.Schema({
  studentName: {
    type: String,
    required: [true, 'Please provide a student name'],
    trim: true
  },
  gradeLevel: {
    type: String,
    required: [true, 'Please provide a grade level']
  },
  date: {
    type: Date,
    required: [true, 'Please provide a date'],
    default: Date.now
  },
  behaviorType: {
    type: String,
    required: [true, 'Please provide a behavior type'],
    enum: ['Positive', 'Concerning', 'Neutral'],
    default: 'Neutral'
  },
  category: {
    type: String,
    required: [true, 'Please provide a behavior category'],
    enum: [
      'Academic Engagement', 
      'Classroom Conduct', 
      'Social Interaction', 
      'Emotional Regulation',
      'Other'
    ]
  },
  description: {
    type: String,
    required: [true, 'Please provide a description of the behavior']
  },
  actionTaken: {
    type: String
  },
  followUpNeeded: {
    type: Boolean,
    default: false
  },
  followUpNotes: {
    type: String
  },
  parentNotified: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('BehaviorTracker', BehaviorTrackerSchema); 