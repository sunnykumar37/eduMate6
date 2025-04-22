import axios from 'axios';

const API_URL = '/api/teacher-tools/assignments';

// Mock data for development
const mockAssignments = [
  {
    id: '1',
    title: 'Cell Structure and Function',
    subject: 'Science',
    gradeLevel: '7',
    dueDate: '2023-11-15T00:00:00.000Z',
    pointsPossible: 100,
    description: 'A comprehensive assignment on cell structures and their functions',
    instructions: 'Create a detailed diagram of an animal cell and a plant cell. Label all major organelles and write a short description of each organelle\'s function. Compare and contrast the two types of cells.',
    curriculumStandards: 'MS-LS1-2: Develop and use a model to describe the function of a cell as a whole and ways the parts of cells contribute to the function.',
    rubric: {
      criteria: [
        {
          name: 'Cell Diagram Accuracy',
          description: 'Accuracy and completeness of cell diagrams',
          levels: [
            { score: 25, description: 'Excellent: All organelles accurately drawn and positioned' },
            { score: 20, description: 'Good: Most organelles accurately drawn with minor errors' },
            { score: 15, description: 'Satisfactory: Some organelles missing or incorrectly drawn' },
            { score: 10, description: 'Needs Improvement: Many organelles missing or incorrect' }
          ]
        },
        {
          name: 'Organelle Descriptions',
          description: 'Quality of descriptions for each organelle function',
          levels: [
            { score: 25, description: 'Excellent: Detailed and accurate descriptions for all organelles' },
            { score: 20, description: 'Good: Accurate descriptions with some detail missing' },
            { score: 15, description: 'Satisfactory: Basic descriptions with some inaccuracies' },
            { score: 10, description: 'Needs Improvement: Incomplete or inaccurate descriptions' }
          ]
        },
        {
          name: 'Comparison Analysis',
          description: 'Quality of comparison between plant and animal cells',
          levels: [
            { score: 25, description: 'Excellent: Thorough, insightful comparison with specific examples' },
            { score: 20, description: 'Good: Clear comparison with most key differences identified' },
            { score: 15, description: 'Satisfactory: Basic comparison with some key differences' },
            { score: 10, description: 'Needs Improvement: Minimal comparison lacking detail' }
          ]
        },
        {
          name: 'Presentation & Organization',
          description: 'Overall presentation quality and organization',
          levels: [
            { score: 25, description: 'Excellent: Well-organized, neat, and visually appealing' },
            { score: 20, description: 'Good: Organized and neat with minor issues' },
            { score: 15, description: 'Satisfactory: Somewhat organized but lacking visual clarity' },
            { score: 10, description: 'Needs Improvement: Disorganized or difficult to follow' }
          ]
        }
      ]
    },
    createdAt: '2023-10-15T14:30:00.000Z',
    updatedAt: '2023-10-15T14:30:00.000Z'
  },
  {
    id: '2',
    title: 'Poetry Analysis Essay',
    subject: 'Language Arts',
    gradeLevel: '9',
    dueDate: '2023-11-20T00:00:00.000Z',
    pointsPossible: 50,
    description: 'An analytical essay examining themes and literary devices in selected poems',
    instructions: 'Choose one poem from the provided selection and write a 2-3 page analytical essay. Identify the main themes, analyze at least three literary devices used, and explain how these elements contribute to the overall meaning of the poem.',
    curriculumStandards: 'CCSS.ELA-LITERACY.RL.9-10.4: Determine the meaning of words and phrases as they are used in the text, including figurative and connotative meanings; analyze the cumulative impact of specific word choices on meaning and tone.',
    rubric: {
      criteria: [
        {
          name: 'Thesis & Analysis',
          description: 'Strength of thesis and depth of analysis',
          levels: [
            { score: 15, description: 'Excellent: Clear, insightful thesis with sophisticated analysis' },
            { score: 12, description: 'Good: Clear thesis with thoughtful analysis' },
            { score: 9, description: 'Satisfactory: Basic thesis with adequate analysis' },
            { score: 6, description: 'Needs Improvement: Unclear thesis with superficial analysis' }
          ]
        },
        {
          name: 'Literary Device Analysis',
          description: 'Quality of literary device identification and analysis',
          levels: [
            { score: 15, description: 'Excellent: Insightful analysis of 3+ devices with textual evidence' },
            { score: 12, description: 'Good: Solid analysis of 3 devices with some textual evidence' },
            { score: 9, description: 'Satisfactory: Basic analysis of 2-3 devices' },
            { score: 6, description: 'Needs Improvement: Minimal analysis of 1-2 devices' }
          ]
        },
        {
          name: 'Organization & Structure',
          description: 'Essay organization and structural coherence',
          levels: [
            { score: 10, description: 'Excellent: Logical flow with clear intro, body, and conclusion' },
            { score: 8, description: 'Good: Generally organized with minor structural issues' },
            { score: 6, description: 'Satisfactory: Basic organization with some structural problems' },
            { score: 4, description: 'Needs Improvement: Disorganized with significant structural issues' }
          ]
        },
        {
          name: 'Writing Mechanics',
          description: 'Grammar, spelling, punctuation, and writing style',
          levels: [
            { score: 10, description: 'Excellent: Virtually error-free with sophisticated style' },
            { score: 8, description: 'Good: Few errors with clear, effective style' },
            { score: 6, description: 'Satisfactory: Some errors that don\'t impede understanding' },
            { score: 4, description: 'Needs Improvement: Numerous errors that impede understanding' }
          ]
        }
      ]
    },
    createdAt: '2023-10-18T09:45:00.000Z',
    updatedAt: '2023-10-18T09:45:00.000Z'
  },
  {
    id: '3',
    title: 'World War II Research Project',
    subject: 'History',
    gradeLevel: '10',
    dueDate: '2023-12-05T00:00:00.000Z',
    pointsPossible: 150,
    description: 'A comprehensive research project on a specific aspect of World War II',
    instructions: 'Select a specific event, person, or development from World War II. Conduct research using at least 5 credible sources and create both a 4-5 page research paper and a visual presentation. Your project should address the historical significance, key details, and lasting impact of your chosen topic.',
    curriculumStandards: 'CCSS.ELA-LITERACY.RH.9-10.9: Compare and contrast treatments of the same topic in several primary and secondary sources.',
    rubric: {
      criteria: [
        {
          name: 'Research Quality',
          description: 'Depth of research and source quality',
          levels: [
            { score: 40, description: 'Excellent: Extensive research with 5+ high-quality sources' },
            { score: 35, description: 'Good: Solid research with 5 credible sources' },
            { score: 30, description: 'Satisfactory: Basic research with 3-4 credible sources' },
            { score: 25, description: 'Needs Improvement: Limited research with fewer than 3 credible sources' }
          ]
        },
        {
          name: 'Content & Analysis',
          description: 'Quality and depth of historical analysis',
          levels: [
            { score: 40, description: 'Excellent: Comprehensive, insightful analysis with specific details' },
            { score: 35, description: 'Good: Strong analysis with relevant historical details' },
            { score: 30, description: 'Satisfactory: Adequate analysis with some historical context' },
            { score: 25, description: 'Needs Improvement: Superficial analysis lacking historical context' }
          ]
        },
        {
          name: 'Written Component',
          description: 'Quality of research paper',
          levels: [
            { score: 40, description: 'Excellent: Well-structured, error-free paper with sophisticated arguments' },
            { score: 35, description: 'Good: Organized paper with few errors and clear arguments' },
            { score: 30, description: 'Satisfactory: Generally organized with some errors' },
            { score: 25, description: 'Needs Improvement: Poorly organized with numerous errors' }
          ]
        },
        {
          name: 'Visual Presentation',
          description: 'Quality and effectiveness of visual component',
          levels: [
            { score: 30, description: 'Excellent: Engaging, informative presentation with creative elements' },
            { score: 25, description: 'Good: Clear presentation with relevant visuals' },
            { score: 20, description: 'Satisfactory: Basic presentation with adequate visuals' },
            { score: 15, description: 'Needs Improvement: Minimal visual support or poorly executed' }
          ]
        }
      ]
    },
    createdAt: '2023-10-25T11:20:00.000Z',
    updatedAt: '2023-10-25T11:20:00.000Z'
  },
  {
    id: '4',
    title: 'Fraction Operations Practice',
    subject: 'Mathematics',
    gradeLevel: '5',
    dueDate: '2023-11-10T00:00:00.000Z',
    pointsPossible: 25,
    description: 'Practice assignment on adding, subtracting, multiplying, and dividing fractions',
    instructions: 'Complete all problems in the worksheet. Show all your work, including finding common denominators and simplifying your answers to the lowest terms.',
    curriculumStandards: 'CCSS.MATH.CONTENT.5.NF.A.1: Add and subtract fractions with unlike denominators by replacing given fractions with equivalent fractions.',
    rubric: {
      criteria: [
        {
          name: 'Computational Accuracy',
          description: 'Correctness of calculations',
          levels: [
            { score: 10, description: 'Excellent: All calculations correct' },
            { score: 8, description: 'Good: Most calculations correct with minor errors' },
            { score: 6, description: 'Satisfactory: Some correct calculations with several errors' },
            { score: 4, description: 'Needs Improvement: Many calculation errors' }
          ]
        },
        {
          name: 'Work Shown',
          description: 'Quality and completeness of work shown',
          levels: [
            { score: 10, description: 'Excellent: Clear, complete work shown for all problems' },
            { score: 8, description: 'Good: Work shown for most problems' },
            { score: 6, description: 'Satisfactory: Some work shown but incomplete in places' },
            { score: 4, description: 'Needs Improvement: Little or no work shown' }
          ]
        },
        {
          name: 'Fraction Simplification',
          description: 'Accuracy of fraction simplification',
          levels: [
            { score: 5, description: 'Excellent: All fractions simplified correctly' },
            { score: 4, description: 'Good: Most fractions simplified correctly' },
            { score: 3, description: 'Satisfactory: Some fractions simplified correctly' },
            { score: 2, description: 'Needs Improvement: Few or no fractions simplified correctly' }
          ]
        }
      ]
    },
    createdAt: '2023-10-28T10:15:00.000Z',
    updatedAt: '2023-10-28T10:15:00.000Z'
  },
  {
    id: '5',
    title: 'Spanish Conversation Practice',
    subject: 'Foreign Language',
    gradeLevel: '8',
    dueDate: '2023-11-18T00:00:00.000Z',
    pointsPossible: 30,
    description: 'Oral practice assignment focused on restaurant conversations in Spanish',
    instructions: 'With a partner, create and perform a 3-minute dialogue that takes place in a restaurant. Include greeting, ordering food, asking questions, handling payment, and saying goodbye. Use at least 10 vocabulary words from our recent unit.',
    curriculumStandards: 'World Language Standard 1.1: Students engage in conversations, provide and obtain information, express feelings and emotions, and exchange opinions.',
    rubric: {
      criteria: [
        {
          name: 'Vocabulary Usage',
          description: 'Appropriate use of required vocabulary',
          levels: [
            { score: 10, description: 'Excellent: 10+ vocabulary words used correctly and naturally' },
            { score: 8, description: 'Good: 10 vocabulary words used mostly correctly' },
            { score: 6, description: 'Satisfactory: 7-9 vocabulary words used with some errors' },
            { score: 4, description: 'Needs Improvement: Fewer than 7 vocabulary words used' }
          ]
        },
        {
          name: 'Pronunciation & Fluency',
          description: 'Clarity of pronunciation and natural flow',
          levels: [
            { score: 10, description: 'Excellent: Clear pronunciation with natural pace and minimal hesitation' },
            { score: 8, description: 'Good: Generally clear with occasional hesitation' },
            { score: 6, description: 'Satisfactory: Understandable but with frequent hesitation' },
            { score: 4, description: 'Needs Improvement: Difficult to understand with unnatural pacing' }
          ]
        },
        {
          name: 'Grammar Usage',
          description: 'Grammatical accuracy',
          levels: [
            { score: 10, description: 'Excellent: Few or no grammatical errors' },
            { score: 8, description: 'Good: Some minor grammatical errors' },
            { score: 6, description: 'Satisfactory: Several grammatical errors' },
            { score: 4, description: 'Needs Improvement: Frequent grammatical errors' }
          ]
        }
      ]
    },
    createdAt: '2023-11-01T09:30:00.000Z',
    updatedAt: '2023-11-01T09:30:00.000Z'
  }
];

// Function to simulate API delay
const simulateDelay = (ms = 600) => new Promise(resolve => setTimeout(resolve, ms));

// Get all assignments
export const getAllAssignments = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching assignments:', error);
    // Return mock data for development
    await simulateDelay();
    return mockAssignments;
  }
};

// Get assignment by ID
export const getAssignmentById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching assignment with ID ${id}:`, error);
    // Return mock data for development
    await simulateDelay();
    return mockAssignments.find(assignment => assignment.id === id);
  }
};

// Create new assignment
export const createAssignment = async (assignmentData) => {
  try {
    const response = await axios.post(API_URL, assignmentData);
    return response.data;
  } catch (error) {
    console.error('Error creating assignment:', error);
    // For development, create a mock response
    await simulateDelay();
    const newAssignment = {
      id: (Math.max(...mockAssignments.map(a => parseInt(a.id))) + 1).toString(),
      ...assignmentData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    return newAssignment;
  }
};

// Update assignment
export const updateAssignment = async (id, assignmentData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, assignmentData);
    return response.data;
  } catch (error) {
    console.error(`Error updating assignment with ID ${id}:`, error);
    // For development, return updated mock data
    await simulateDelay();
    return {
      id,
      ...assignmentData,
      updatedAt: new Date().toISOString()
    };
  }
};

// Delete assignment
export const deleteAssignment = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting assignment with ID ${id}:`, error);
    // For development, return success response
    await simulateDelay();
    return { id, success: true };
  }
};

// Search assignments
export const searchAssignments = async (searchParams) => {
  try {
    const queryString = Object.entries(searchParams)
      .filter(([_, value]) => value)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&');
    
    const response = await axios.get(`${API_URL}/search/criteria?${queryString}`);
    return response.data;
  } catch (error) {
    console.error('Error searching assignments:', error);
    // For development, filter mock data based on search params
    await simulateDelay();
    
    let filteredAssignments = [...mockAssignments];
    
    if (searchParams.title) {
      filteredAssignments = filteredAssignments.filter(assignment => 
        assignment.title.toLowerCase().includes(searchParams.title.toLowerCase())
      );
    }
    
    if (searchParams.subject) {
      filteredAssignments = filteredAssignments.filter(assignment => 
        assignment.subject === searchParams.subject
      );
    }
    
    if (searchParams.gradeLevel) {
      filteredAssignments = filteredAssignments.filter(assignment => 
        assignment.gradeLevel === searchParams.gradeLevel
      );
    }
    
    return filteredAssignments;
  }
};

// Generate rubric
export const generateRubric = async (assignmentData) => {
  try {
    const response = await axios.post(`${API_URL}/generate-rubric`, assignmentData);
    return response.data;
  } catch (error) {
    console.error('Error generating rubric:', error);
    // For development, return mock rubric
    await simulateDelay(1500);
    
    return {
      criteria: [
        {
          name: 'Content Knowledge',
          description: 'Accuracy and depth of subject knowledge',
          levels: [
            { score: 25, description: 'Excellent: Comprehensive understanding with specific examples' },
            { score: 20, description: 'Good: Solid understanding with some examples' },
            { score: 15, description: 'Satisfactory: Basic understanding with limited examples' },
            { score: 10, description: 'Needs Improvement: Limited understanding with inaccuracies' }
          ]
        },
        {
          name: 'Organization',
          description: 'Structure and logical flow',
          levels: [
            { score: 25, description: 'Excellent: Well-organized with clear transitions' },
            { score: 20, description: 'Good: Organized with some transitions' },
            { score: 15, description: 'Satisfactory: Somewhat organized but lacks flow' },
            { score: 10, description: 'Needs Improvement: Disorganized and difficult to follow' }
          ]
        },
        {
          name: 'Analysis & Critical Thinking',
          description: 'Depth of analysis and critical thinking',
          levels: [
            { score: 25, description: 'Excellent: Insightful analysis with original thinking' },
            { score: 20, description: 'Good: Thoughtful analysis showing some critical thinking' },
            { score: 15, description: 'Satisfactory: Basic analysis with limited critical thinking' },
            { score: 10, description: 'Needs Improvement: Little analysis or critical thinking' }
          ]
        },
        {
          name: 'Presentation & Mechanics',
          description: 'Quality of presentation, grammar, and mechanics',
          levels: [
            { score: 25, description: 'Excellent: Professional presentation with virtually no errors' },
            { score: 20, description: 'Good: Clear presentation with few errors' },
            { score: 15, description: 'Satisfactory: Adequate presentation with some errors' },
            { score: 10, description: 'Needs Improvement: Poor presentation with many errors' }
          ]
        }
      ]
    };
  }
}; 