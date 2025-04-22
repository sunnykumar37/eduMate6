const mongoose = require('mongoose');

const CurriculumSchema = new mongoose.Schema(
  {
    standardId: {
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
    description: {
      type: String,
      required: true
    },
    objectives: [{
      type: String,
      required: true
    }],
    keywords: [{
      type: String
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

module.exports = mongoose.model('Curriculum', CurriculumSchema); 