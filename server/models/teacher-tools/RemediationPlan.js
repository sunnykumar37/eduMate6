const mongoose = require('mongoose');

const RemediationPlanSchema = new mongoose.Schema({
  studentName: {
    type: String,
    required: true,
    trim: true
  },
  studentId: {
    type: String,
    required: true,
    trim: true
  },
  gradeLevel: {
    type: String,
    required: true,
    trim: true
  },
  subject: {
    type: String,
    required: true,
    trim: true
  },
  targetAreas: [{
    area: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    curriculumStandard: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Curriculum'
    }
  }],
  goals: [{
    description: {
      type: String,
      required: true
    },
    successCriteria: {
      type: String,
      required: true
    },
    targetDate: {
      type: Date,
      required: true
    }
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
    type: {
      type: String,
      enum: ['practice', 'assessment', 'game', 'project', 'reading', 'other'],
      default: 'practice'
    },
    resources: [{
      type: String,
      trim: true
    }]
  }],
  progress: {
    status: {
      type: String,
      enum: ['not_started', 'in_progress', 'completed'],
      default: 'not_started'
    },
    notes: [{
      date: {
        type: Date,
        default: Date.now
      },
      content: {
        type: String,
        required: true
      },
      progressIndicator: {
        type: String,
        enum: ['significant_progress', 'some_progress', 'little_progress', 'no_progress'],
        required: true
      }
    }]
  },
  startDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  endDate: {
    type: Date
  },
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

    areasOfConcern: [{
      skill: String,
      description: String,
      curriculumStandard: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Curriculum'
      }
    }],
    recommendedActivities: [{
      title: String,
      description: String,
      resources: [{
        title: String,
        link: String,
        type: String
      }],
      targetSkill: String
    }],
    goals: [{
      description: String,
      targetDate: Date,
      isCompleted: {
        type: Boolean,
        default: false
      }
    }],
    assessmentResults: [{
      assessmentName: String,
      date: Date,
      score: Number,
      notes: String
    }],
    notes: {
      type: String
    },
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

module.exports = mongoose.model('RemediationPlan', RemediationPlanSchema); 