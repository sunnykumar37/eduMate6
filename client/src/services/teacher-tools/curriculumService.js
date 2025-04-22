import axios from 'axios';

const API_URL = '/api/teacher-tools/curriculum';

// Mock data for development
const mockCurriculum = [
  {
    id: '1',
    code: 'CCSS.ELA-LITERACY.RL.5.1',
    subject: 'English Language Arts',
    gradeLevel: '5',
    description: 'Quote accurately from a text when explaining what the text says explicitly and when drawing inferences from the text.',
    category: 'Reading: Literature',
    subcategory: 'Key Ideas and Details',
    examples: [
      'Identify explicit textual evidence to support analysis',
      'Quote directly from the text to support inferences',
      'Use accurate quotes to explain meaning and draw conclusions'
    ],
    keywords: ['quote', 'text evidence', 'explicit', 'inference', 'reading literature'],
    relatedStandards: ['CCSS.ELA-LITERACY.RL.5.2', 'CCSS.ELA-LITERACY.RL.5.3'],
    createdAt: '2023-08-10T09:30:00.000Z',
    updatedAt: '2023-08-10T09:30:00.000Z'
  },
  {
    id: '2',
    code: 'CCSS.MATH.CONTENT.5.NF.A.1',
    subject: 'Mathematics',
    gradeLevel: '5',
    description: 'Add and subtract fractions with unlike denominators (including mixed numbers) by replacing given fractions with equivalent fractions in such a way as to produce an equivalent sum or difference of fractions with like denominators.',
    category: 'Number and Operations - Fractions',
    subcategory: 'Use equivalent fractions as a strategy to add and subtract fractions',
    examples: [
      'Convert fractions to equivalent fractions with like denominators',
      'Add fractions with unlike denominators',
      'Subtract fractions with unlike denominators',
      'Solve word problems involving addition and subtraction of fractions'
    ],
    keywords: ['fractions', 'addition', 'subtraction', 'unlike denominators', 'equivalent fractions'],
    relatedStandards: ['CCSS.MATH.CONTENT.5.NF.A.2', 'CCSS.MATH.CONTENT.4.NF.A.1'],
    createdAt: '2023-08-12T11:45:00.000Z',
    updatedAt: '2023-08-12T11:45:00.000Z'
  },
  {
    id: '3',
    code: 'NGSS.MS-LS1-2',
    subject: 'Science',
    gradeLevel: '6-8',
    description: 'Develop and use a model to describe the function of a cell as a whole and ways the parts of cells contribute to the function.',
    category: 'Life Science',
    subcategory: 'Structure, Function, and Information Processing',
    examples: [
      'Create a model showing cell organelles and their functions',
      'Explain how different cell structures contribute to overall cell function',
      'Compare and contrast plant and animal cell structures'
    ],
    keywords: ['cells', 'organelles', 'cell structure', 'cell function', 'models'],
    relatedStandards: ['NGSS.MS-LS1-1', 'NGSS.MS-LS1-3'],
    createdAt: '2023-08-15T13:20:00.000Z',
    updatedAt: '2023-08-15T13:20:00.000Z'
  },
  {
    id: '4',
    code: 'CCSS.ELA-LITERACY.W.8.1',
    subject: 'English Language Arts',
    gradeLevel: '8',
    description: 'Write arguments to support claims with clear reasons and relevant evidence.',
    category: 'Writing',
    subcategory: 'Text Types and Purposes',
    examples: [
      'Introduce claim(s) and organize reasons and evidence clearly',
      'Support claim(s) with logical reasoning and relevant evidence',
      'Use words, phrases, and clauses to create cohesion',
      'Establish and maintain a formal style',
      'Provide a concluding statement that follows from the argument'
    ],
    keywords: ['arguments', 'claims', 'evidence', 'reasoning', 'writing'],
    relatedStandards: ['CCSS.ELA-LITERACY.W.8.2', 'CCSS.ELA-LITERACY.W.8.4'],
    createdAt: '2023-08-20T10:15:00.000Z',
    updatedAt: '2023-08-20T10:15:00.000Z'
  },
  {
    id: '5',
    code: 'CCSS.MATH.CONTENT.HSG.SRT.B.5',
    subject: 'Mathematics',
    gradeLevel: '9-12',
    description: 'Use congruence and similarity criteria for triangles to solve problems and to prove relationships in geometric figures.',
    category: 'Geometry',
    subcategory: 'Similarity, Right Triangles, and Trigonometry',
    examples: [
      'Apply congruence criteria to solve problems about triangles',
      'Use similarity criteria to prove relationships in geometric figures',
      'Solve problems involving scale factors and proportional reasoning',
      'Apply the Pythagorean theorem in contextual problems'
    ],
    keywords: ['congruence', 'similarity', 'triangles', 'geometric proofs', 'proportional reasoning'],
    relatedStandards: ['CCSS.MATH.CONTENT.HSG.SRT.B.4', 'CCSS.MATH.CONTENT.HSG.SRT.C.6'],
    createdAt: '2023-08-22T14:40:00.000Z',
    updatedAt: '2023-08-22T14:40:00.000Z'
  }
];

// Function to simulate API delay
const simulateDelay = (ms = 600) => new Promise(resolve => setTimeout(resolve, ms));

// Get all curriculum standards
export const getAllCurriculum = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching curriculum standards:', error);
    // Return mock data for development
    await simulateDelay();
    return mockCurriculum || [];
  }
};

// Get curriculum by ID
export const getCurriculumById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching curriculum standard with ID ${id}:`, error);
    // Return mock data for development
    await simulateDelay();
    return mockCurriculum.find(standard => standard.id === id);
  }
};

// Create new curriculum standard
export const createCurriculum = async (curriculumData) => {
  try {
    const response = await axios.post(API_URL, curriculumData);
    return response.data;
  } catch (error) {
    console.error('Error creating curriculum standard:', error);
    // For development, create a mock response
    await simulateDelay();
    const newCurriculum = {
      id: (Math.max(...mockCurriculum.map(c => parseInt(c.id))) + 1).toString(),
      ...curriculumData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    return newCurriculum;
  }
};

// Update curriculum standard
export const updateCurriculum = async (id, curriculumData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, curriculumData);
    return response.data;
  } catch (error) {
    console.error(`Error updating curriculum standard with ID ${id}:`, error);
    // For development, return updated mock data
    await simulateDelay();
    return {
      id,
      ...curriculumData,
      updatedAt: new Date().toISOString()
    };
  }
};

// Delete curriculum standard
export const deleteCurriculum = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting curriculum standard with ID ${id}:`, error);
    // For development, return success response
    await simulateDelay();
    return { id, success: true };
  }
};

// Search curriculum standards
export const searchCurriculum = async (searchParams) => {
  try {
    const queryString = Object.entries(searchParams)
      .filter(([_, value]) => value)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&');
    
    const response = await axios.get(`${API_URL}/search/criteria?${queryString}`);
    return response.data;
  } catch (error) {
    console.error('Error searching curriculum standards:', error);
    // For development, filter mock data based on search params
    await simulateDelay();
    
    let filteredStandards = [...(mockCurriculum || [])];
    
    if (searchParams.code) {
      filteredStandards = filteredStandards.filter(standard => 
        standard.code.toLowerCase().includes(searchParams.code.toLowerCase())
      );
    }
    
    if (searchParams.subject) {
      filteredStandards = filteredStandards.filter(standard => 
        standard.subject === searchParams.subject
      );
    }
    
    if (searchParams.gradeLevel) {
      filteredStandards = filteredStandards.filter(standard => 
        standard.gradeLevel === searchParams.gradeLevel || 
        (standard.gradeLevel.includes('-') && searchParams.gradeLevel >= standard.gradeLevel.split('-')[0] && 
        searchParams.gradeLevel <= standard.gradeLevel.split('-')[1])
      );
    }
    
    if (searchParams.category) {
      filteredStandards = filteredStandards.filter(standard => 
        standard.category === searchParams.category
      );
    }
    
    if (searchParams.keyword) {
      filteredStandards = filteredStandards.filter(standard => 
        standard.keywords.some(keyword => keyword.toLowerCase().includes(searchParams.keyword.toLowerCase())) ||
        standard.description.toLowerCase().includes(searchParams.keyword.toLowerCase())
      );
    }
    
    return filteredStandards;
  }
};

// Check alignment between content and curriculum standard
export const checkAlignment = async (curriculumId, content) => {
  try {
    const response = await axios.post(`${API_URL}/check-alignment`, { 
      curriculumId, 
      content 
    });
    return response.data;
  } catch (error) {
    console.error('Error checking alignment:', error);
    // For development, generate mock alignment results
    await simulateDelay(1200);
    
    const standard = mockCurriculum.find(s => s.id === curriculumId);
    if (!standard) {
      throw new Error('Curriculum standard not found');
    }
    
    // Simple mock analysis that checks if keywords from the standard appear in the content
    const keywordMatches = standard.keywords.filter(keyword => 
      content.toLowerCase().includes(keyword.toLowerCase())
    );
    
    const alignmentScore = Math.min(100, Math.round((keywordMatches.length / standard.keywords.length) * 100));
    
    return {
      curriculumStandard: standard,
      alignmentScore: alignmentScore,
      matchedKeywords: keywordMatches,
      recommendations: alignmentScore < 70 
        ? [
            'Consider adding more specific content related to the standard',
            `Include more references to: ${standard.keywords.filter(k => !keywordMatches.includes(k)).join(', ')}`,
            'Provide examples that directly demonstrate the standard in action'
          ] 
        : [
            'Good alignment with the standard',
            'Consider adding assessment items that directly measure this standard',
            'Add extension activities to further reinforce the concepts'
          ]
    };
  }
}; 