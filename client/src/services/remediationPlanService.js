import axios from 'axios';

// Mock data for development
const mockPlans = [
  {
    id: '1',
    studentName: 'Alex Johnson',
    gradeLevel: '3',
    subject: 'Math',
    startDate: '2023-11-01T00:00:00.000Z',
    endDate: '2023-12-15T00:00:00.000Z',
    status: 'In Progress',
    goals: 'Improve understanding of multiplication and division concepts. Master basic multiplication tables up to 12.',
    interventions: '1. Daily 10-minute multiplication practice\n2. Use of manipulatives to visualize groups\n3. Weekly one-on-one tutoring sessions\n4. Interactive math games that focus on multiplication',
    assessmentCriteria: 'Weekly multiplication quizzes with a target of 80% accuracy. End-of-unit test score improvement by at least 15%.',
    notes: 'Alex responds well to visual learning strategies. Parent has agreed to practice multiplication facts at home.'
  },
  {
    id: '2',
    studentName: 'Sarah Martinez',
    gradeLevel: '5',
    subject: 'ELA',
    startDate: '2023-10-15T00:00:00.000Z',
    endDate: '2023-12-20T00:00:00.000Z',
    status: 'Not Started',
    goals: 'Improve reading comprehension and vocabulary usage. Develop stronger paragraph writing skills with clear topic sentences and supporting details.',
    interventions: '1. Guided reading sessions three times per week\n2. Vocabulary journals with visual associations\n3. Paragraph structure templates\n4. Reading response activities focused on main idea and supporting details',
    assessmentCriteria: 'Reading comprehension assessments showing improvement from current 65% to target 80%. Writing samples evaluated using grade-level rubric.',
    notes: 'Sarah enjoys reading but struggles with extracting key information. Consider using high-interest texts about animals.'
  },
  {
    id: '3',
    studentName: 'Michael Lee',
    gradeLevel: '7',
    subject: 'Science',
    startDate: '2023-09-10T00:00:00.000Z',
    endDate: '2023-11-30T00:00:00.000Z',
    status: 'Completed',
    goals: 'Develop understanding of scientific method and improve ability to design and analyze experiments.',
    interventions: '1. Structured lab activities with explicit focus on methodology\n2. Science journal to document observations and conclusions\n3. Peer collaboration on experimental design\n4. Visual guides for scientific method steps',
    assessmentCriteria: 'Lab reports graded using scientific method rubric. Performance-based assessment requiring design of original experiment.',
    notes: 'Michael has shown significant improvement in understanding experimental variables. Final assessment showed mastery of content.'
  },
  {
    id: '4',
    studentName: 'Emily Wilson',
    gradeLevel: '4',
    subject: 'Math',
    startDate: '2023-10-05T00:00:00.000Z',
    endDate: '2024-01-15T00:00:00.000Z',
    status: 'In Progress',
    goals: 'Master fraction concepts including equivalence, comparison, and basic operations with fractions.',
    interventions: '1. Use of fraction manipulatives and visual models\n2. Real-world fraction problems involving cooking and measurements\n3. Fraction games and interactive activities\n4. Small group instruction three times weekly',
    assessmentCriteria: 'Weekly skill checks on fraction concepts. Summative assessment requiring application of fraction knowledge in word problems.',
    notes: 'Emily struggles with the concept of equivalent fractions. Using fraction strips has been helpful in visualizing the relationships.'
  },
  {
    id: '5',
    studentName: 'Jamal Washington',
    gradeLevel: '6',
    subject: 'Social Studies',
    startDate: '2023-11-10T00:00:00.000Z',
    endDate: '2024-01-20T00:00:00.000Z',
    status: 'On Hold',
    goals: 'Improve understanding of geographical concepts and map reading skills. Develop ability to analyze how geography affects human settlement patterns.',
    interventions: '1. Interactive map activities\n2. Geographic information system (GIS) introductory lessons\n3. Case studies of different regions\n4. Creation of maps to demonstrate understanding',
    assessmentCriteria: 'Map identification quizzes. Project-based assessment requiring analysis of a region\'s geography and its impact on human activity.',
    notes: 'Plan temporarily on hold due to student absence. Will resume when Jamal returns to school.'
  }
];

// API URL for when we connect to a real backend
const API_URL = '/api/teacher-tools/remediation-plans';

// Function to simulate API delay
const simulateDelay = (ms = 600) => new Promise(resolve => setTimeout(resolve, ms));

// Get all remediation plans
export const getAllRemediationPlans = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching remediation plans:', error);
    throw error;
  }
};

// Get a specific remediation plan by ID
export const getRemediationPlanById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching remediation plan with ID ${id}:`, error);
    throw error;
  }
};

// Create a new remediation plan
export const createRemediationPlan = async (planData) => {
  try {
    const response = await axios.post(API_URL, planData);
    return response.data;
  } catch (error) {
    console.error('Error creating remediation plan:', error);
    throw error;
  }
};

// Update an existing remediation plan
export const updateRemediationPlan = async (id, planData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, planData);
    return response.data;
  } catch (error) {
    console.error(`Error updating remediation plan with ID ${id}:`, error);
    throw error;
  }
};

// Delete a remediation plan
export const deleteRemediationPlan = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting remediation plan with ID ${id}:`, error);
    throw error;
  }
};

// Search remediation plans
export const searchRemediationPlans = async (filters) => {
  try {
    const response = await axios.get(`${API_URL}/search`, { params: filters });
    return response.data;
  } catch (error) {
    console.error('Error searching remediation plans:', error);
    throw error;
  }
};

// Add progress note to remediation plan
export const addProgressNote = async (id, noteData) => {
  try {
    const response = await axios.post(`${API_URL}/${id}/progress-note`, noteData);
    return response.data;
  } catch (error) {
    console.error(`Error adding progress note to remediation plan with ID ${id}:`, error);
    throw error;
  }
};

// Generate remediation plan suggestions
export const generateSuggestions = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/generate-suggestions`, data);
    return response.data;
  } catch (error) {
    console.error('Error generating remediation plan suggestions:', error);
    throw error;
  }
}; 