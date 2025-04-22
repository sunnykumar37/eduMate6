const mongoose = require('mongoose');

const RubricCriteriaSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  pointsPossible: {
    type: Number,
    required: true,
    min: 0
  },
  levels: [{
    score: Number,
    description: String
  }]
});

const AssignmentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    instructions: {
      type: String,
      required: true
    },
    subject: {
      type: String,
      required: true,
      trim: true
    },
    gradeLevel: {
      type: String,
      required: true,
      trim: true
    },
    dueDate: {
      type: Date
    },
    pointsPossible: {
      type: Number,
      required: true,
      min: 0
    },
    curriculumStandards: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Curriculum'
    }],
    rubric: [RubricCriteriaSchema],
    attachments: [{
      filename: String,
      path: String,
      mimetype: String
    }],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Assignment', AssignmentSchema); 