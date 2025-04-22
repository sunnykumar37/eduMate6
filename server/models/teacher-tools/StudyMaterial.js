const mongoose = require('mongoose');

const StudyMaterialSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
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
  topic: {
    type: String,
    required: true,
    trim: true
  },
  learningLevel: {
    type: String,
    required: true,
    enum: ['basic', 'intermediate', 'advanced'],
    default: 'intermediate'
  },
  content: {
    type: String,
    required: true
  },
  resources: [{
    type: String,
    trim: true
  }],
  activities: [{
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    difficultyLevel: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium'
    }
  }],
  curriculumStandards: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Curriculum'
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('StudyMaterial', StudyMaterialSchema); 