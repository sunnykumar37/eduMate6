const Curriculum = require('../../models/teacher-tools/Curriculum');

// Get all curriculum standards
exports.getAllCurriculum = async (req, res) => {
  try {
    const curricula = await Curriculum.find().sort({ createdAt: -1 });
    res.status(200).json(curricula);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching curriculum standards', error: error.message });
  }
};

// Get curriculum by ID
exports.getCurriculumById = async (req, res) => {
  try {
    const curriculum = await Curriculum.findById(req.params.id);
    if (!curriculum) {
      return res.status(404).json({ message: 'Curriculum standard not found' });
    }
    res.status(200).json(curriculum);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching curriculum standard', error: error.message });
  }
};

// Create new curriculum standard
exports.createCurriculum = async (req, res) => {
  try {
    const newCurriculum = new Curriculum({
      ...req.body,
      createdBy: req.user.id // Assuming authentication middleware sets req.user
    });
    const savedCurriculum = await newCurriculum.save();
    res.status(201).json(savedCurriculum);
  } catch (error) {
    res.status(400).json({ message: 'Error creating curriculum standard', error: error.message });
  }
};

// Update curriculum standard
exports.updateCurriculum = async (req, res) => {
  try {
    const updatedCurriculum = await Curriculum.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    if (!updatedCurriculum) {
      return res.status(404).json({ message: 'Curriculum standard not found' });
    }
    res.status(200).json(updatedCurriculum);
  } catch (error) {
    res.status(400).json({ message: 'Error updating curriculum standard', error: error.message });
  }
};

// Delete curriculum standard
exports.deleteCurriculum = async (req, res) => {
  try {
    const curriculum = await Curriculum.findByIdAndDelete(req.params.id);
    if (!curriculum) {
      return res.status(404).json({ message: 'Curriculum standard not found' });
    }
    res.status(200).json({ message: 'Curriculum standard deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting curriculum standard', error: error.message });
  }
};

// Search curriculum standards by criteria
exports.searchCurriculum = async (req, res) => {
  try {
    const { subject, gradeLevel, keywords, standardId } = req.query;
    const query = {};

    if (subject) query.subject = new RegExp(subject, 'i');
    if (gradeLevel) query.gradeLevel = new RegExp(gradeLevel, 'i');
    if (standardId) query.standardId = new RegExp(standardId, 'i');
    if (keywords) {
      query.$or = [
        { keywords: { $in: [new RegExp(keywords, 'i')] } },
        { description: new RegExp(keywords, 'i') }
      ];
    }

    const curricula = await Curriculum.find(query).sort({ createdAt: -1 });
    res.status(200).json(curricula);
  } catch (error) {
    res.status(500).json({ message: 'Error searching curriculum standards', error: error.message });
  }
};

// Check alignment between content and curriculum standard
exports.checkAlignment = async (req, res) => {
  try {
    const { curriculumId, content } = req.body;
    
    if (!curriculumId || !content) {
      return res.status(400).json({ message: 'Curriculum ID and content are required' });
    }
    
    const curriculum = await Curriculum.findById(curriculumId);
    if (!curriculum) {
      return res.status(404).json({ message: 'Curriculum standard not found' });
    }
    
    // Simple keyword-based alignment check
    // In a real application, you might use more sophisticated NLP techniques
    const alignmentScore = calculateAlignmentScore(content, curriculum);
    
    res.status(200).json({
      alignmentScore,
      curriculum,
      matchedKeywords: findMatchedKeywords(content, curriculum),
      suggestions: generateSuggestions(alignmentScore, curriculum)
    });
  } catch (error) {
    res.status(500).json({ message: 'Error checking alignment', error: error.message });
  }
};

// Helper function to calculate alignment score
const calculateAlignmentScore = (content, curriculum) => {
  let score = 0;
  const contentLower = content.toLowerCase();
  
  // Check for keywords
  if (curriculum.keywords && curriculum.keywords.length > 0) {
    curriculum.keywords.forEach(keyword => {
      if (contentLower.includes(keyword.toLowerCase())) {
        score += 10;
      }
    });
  }
  
  // Check for objectives
  if (curriculum.objectives && curriculum.objectives.length > 0) {
    curriculum.objectives.forEach(objective => {
      const objectiveWords = objective.toLowerCase().split(' ')
        .filter(word => word.length > 3); // Filter out small words
      
      objectiveWords.forEach(word => {
        if (contentLower.includes(word)) {
          score += 5;
        }
      });
    });
  }
  
  // Normalize score (0-100)
  const maxPossibleScore = (curriculum.keywords?.length || 0) * 10 + 
                           (curriculum.objectives?.length || 0) * 5 * 5; // Assuming avg 5 words per objective
  
  return Math.min(Math.round((score / Math.max(maxPossibleScore, 1)) * 100), 100);
};

// Helper function to find matched keywords
const findMatchedKeywords = (content, curriculum) => {
  const contentLower = content.toLowerCase();
  const matchedKeywords = [];
  
  // Check keywords
  if (curriculum.keywords && curriculum.keywords.length > 0) {
    curriculum.keywords.forEach(keyword => {
      if (contentLower.includes(keyword.toLowerCase())) {
        matchedKeywords.push(keyword);
      }
    });
  }
  
  // Check objectives for key phrases
  if (curriculum.objectives && curriculum.objectives.length > 0) {
    curriculum.objectives.forEach(objective => {
      const objectiveWords = objective.toLowerCase().split(' ')
        .filter(word => word.length > 3); // Filter out small words
      
      objectiveWords.forEach(word => {
        if (contentLower.includes(word) && !matchedKeywords.includes(word)) {
          matchedKeywords.push(word);
        }
      });
    });
  }
  
  return matchedKeywords;
};

// Helper function to generate suggestions for improvement
const generateSuggestions = (alignmentScore, curriculum) => {
  const suggestions = [];
  
  if (alignmentScore < 30) {
    suggestions.push('The content has very low alignment with the curriculum standard.');
    suggestions.push(`Consider incorporating these objectives: ${curriculum.objectives.join(', ')}`);
    suggestions.push(`Include these keywords: ${curriculum.keywords.join(', ')}`);
  } else if (alignmentScore < 60) {
    suggestions.push('The content has moderate alignment with the curriculum standard.');
    suggestions.push('Consider expanding on the key concepts mentioned in the objectives.');
  } else if (alignmentScore < 90) {
    suggestions.push('The content has good alignment with the curriculum standard.');
    suggestions.push('For perfect alignment, ensure all objectives are thoroughly addressed.');
  } else {
    suggestions.push('Excellent alignment with the curriculum standard!');
  }
  
  return suggestions;
}; 