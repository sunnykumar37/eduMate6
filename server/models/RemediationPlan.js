const mongoose = require('mongoose');

const RemediationPlanSchema = new mongoose.Schema({
  studentName: {
    type: String,
    required: [true, 'Please provide a student name'],
    trim: true
  },
  gradeLevel: {
    type: String,
    required: [true, 'Please provide a grade level']
  },
  subject: {
    type: String,
    required: [true, 'Please provide a subject']
  },
  startDate: {
    type: Date,
    required: [true, 'Please provide a start date']
  },
  endDate: {
    type: Date,
    required: [true, 'Please provide an end date']
  },
  status: {
    type: String,
    required: [true, 'Please provide a status'],
    enum: ['Not Started', 'In Progress', 'Completed', 'On Hold'],
    default: 'Not Started'
  },
  goals: {
    type: String,
    required: [true, 'Please provide goals for the remediation plan']
  },
  interventions: {
    type: String,
    required: [true, 'Please provide intervention strategies']
  },
  assessmentCriteria: {
    type: String,
    required: [true, 'Please provide assessment criteria']
  },
  notes: {
    type: String
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('RemediationPlan', RemediationPlanSchema); 