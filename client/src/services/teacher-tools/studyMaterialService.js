import axios from 'axios';

const API_URL = '/api/teacher-tools/study-materials';

// Mock data for development
const mockStudyMaterials = [
  {
    id: '1',
    title: 'Introduction to Photosynthesis',
    subject: 'Science',
    gradeLevel: '5',
    description: 'A comprehensive introduction to photosynthesis for elementary students',
    contentType: 'Lesson Plan',
    content: 'Photosynthesis is the process by which green plants and some other organisms use sunlight to synthesize foods with the help of chlorophyll. This lesson plan covers the basic concepts of photosynthesis, including light absorption, water utilization, and oxygen production.',
    learningObjectives: '1. Understand the basic process of photosynthesis\n2. Identify the key components needed for photosynthesis\n3. Explain the importance of photosynthesis for life on Earth',
    difficultyLevel: 'Standard',
    tags: ['photosynthesis', 'plants', 'biology', 'elementary science'],
    createdAt: '2023-09-15T10:30:00.000Z',
    updatedAt: '2023-09-15T10:30:00.000Z'
  },
  {
    id: '2',
    title: 'Fractions and Decimals Review',
    subject: 'Mathematics',
    gradeLevel: '4',
    description: 'Review materials for working with fractions and decimals',
    contentType: 'Worksheet',
    content: 'This worksheet contains practice problems for converting between fractions and decimals, comparing fractions with different denominators, and basic fraction operations like addition and subtraction.',
    learningObjectives: '1. Convert between fractions and decimals\n2. Compare and order fractions\n3. Add and subtract fractions with unlike denominators',
    difficultyLevel: 'Standard',
    tags: ['fractions', 'decimals', 'mathematics', 'arithmetic'],
    createdAt: '2023-09-12T14:45:00.000Z',
    updatedAt: '2023-09-12T14:45:00.000Z'
  },
  {
    id: '3',
    title: 'The American Revolution',
    subject: 'Social Studies',
    gradeLevel: '8',
    description: 'Comprehensive unit on the American Revolution and its impact',
    contentType: 'Unit Plan',
    content: 'This unit covers the causes, major events, and outcomes of the American Revolution. Students will examine primary sources, analyze the perspectives of different groups involved, and evaluate the revolution\'s impact on American society and government.',
    learningObjectives: '1. Identify key causes of the American Revolution\n2. Analyze significant events and turning points\n3. Evaluate the revolution\'s impact on American society\n4. Understand different perspectives on the conflict',
    difficultyLevel: 'Advanced',
    tags: ['american revolution', 'history', 'social studies', 'colonial america'],
    createdAt: '2023-08-28T09:15:00.000Z',
    updatedAt: '2023-09-05T11:20:00.000Z'
  },
  {
    id: '4',
    title: 'Poetry Analysis: Haiku and Limerick',
    subject: 'Language Arts',
    gradeLevel: '6',
    description: 'Introduction to analyzing and writing different poetry forms',
    contentType: 'Reading Material',
    content: 'This reading material introduces students to two poetic forms: haiku and limerick. It includes examples of each, their structural elements, and historical contexts. The material also provides guided analysis questions to help students interpret the poems.',
    learningObjectives: '1. Identify the structural elements of haiku and limerick\n2. Analyze the themes and imagery in sample poems\n3. Create original haiku and limericks following the correct form',
    difficultyLevel: 'Standard',
    tags: ['poetry', 'haiku', 'limerick', 'literature', 'language arts'],
    createdAt: '2023-09-08T13:10:00.000Z',
    updatedAt: '2023-09-08T13:10:00.000Z'
  },
  {
    id: '5',
    title: 'States of Matter - Interactive Lab',
    subject: 'Science',
    gradeLevel: '3',
    description: 'Hands-on lab activities exploring solids, liquids, and gases',
    contentType: 'Lab Activity',
    content: 'This lab guide contains three activities demonstrating properties of solids, liquids, and gases. Students will observe and record changes in states of matter, measure volume and mass, and make predictions about how matter behaves under different conditions.',
    learningObjectives: '1. Identify the properties of solids, liquids, and gases\n2. Observe and describe changes between states of matter\n3. Make predictions based on observable patterns',
    difficultyLevel: 'Beginner',
    tags: ['states of matter', 'science', 'lab activity', 'elementary science'],
    createdAt: '2023-09-20T08:45:00.000Z',
    updatedAt: '2023-09-20T08:45:00.000Z'
  }
];

// Function to simulate API delay
const simulateDelay = (ms = 600) => new Promise(resolve => setTimeout(resolve, ms));

// Get all study materials
export const getAllStudyMaterials = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching study materials:', error);
    // Return mock data for development
    await simulateDelay();
    return mockStudyMaterials || [];
  }
};

// Get study material by ID
export const getStudyMaterialById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching study material with ID ${id}:`, error);
    // Return mock data for development
    await simulateDelay();
    return mockStudyMaterials.find(material => material.id === id);
  }
};

// Create new study material
export const createStudyMaterial = async (materialData) => {
  try {
    const response = await axios.post(API_URL, materialData);
    return response.data;
  } catch (error) {
    console.error('Error creating study material:', error);
    // For development, create a mock response
    await simulateDelay();
    const newMaterial = {
      id: (Math.max(...mockStudyMaterials.map(m => parseInt(m.id))) + 1).toString(),
      ...materialData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    return newMaterial;
  }
};

// Update study material
export const updateStudyMaterial = async (id, materialData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, materialData);
    return response.data;
  } catch (error) {
    console.error(`Error updating study material with ID ${id}:`, error);
    // For development, return updated mock data
    await simulateDelay();
    return {
      id,
      ...materialData,
      updatedAt: new Date().toISOString()
    };
  }
};

// Delete study material
export const deleteStudyMaterial = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting study material with ID ${id}:`, error);
    // For development, return success response
    await simulateDelay();
    return { id, success: true };
  }
};

// Search study materials
export const searchStudyMaterials = async (searchParams) => {
  try {
    const queryString = Object.entries(searchParams)
      .filter(([_, value]) => value)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&');
    
    const response = await axios.get(`${API_URL}/search/criteria?${queryString}`);
    return response.data;
  } catch (error) {
    console.error('Error searching study materials:', error);
    // For development, filter mock data based on search params
    await simulateDelay();
    
    let filteredMaterials = [...(mockStudyMaterials || [])];
    
    if (searchParams.title) {
      filteredMaterials = filteredMaterials.filter(material => 
        material.title.toLowerCase().includes(searchParams.title.toLowerCase())
      );
    }
    
    if (searchParams.subject) {
      filteredMaterials = filteredMaterials.filter(material => 
        material.subject === searchParams.subject
      );
    }
    
    if (searchParams.gradeLevel) {
      filteredMaterials = filteredMaterials.filter(material => 
        material.gradeLevel === searchParams.gradeLevel
      );
    }
    
    if (searchParams.contentType) {
      filteredMaterials = filteredMaterials.filter(material => 
        material.contentType === searchParams.contentType
      );
    }
    
    if (searchParams.difficultyLevel) {
      filteredMaterials = filteredMaterials.filter(material => 
        material.difficultyLevel === searchParams.difficultyLevel
      );
    }
    
    return filteredMaterials;
  }
};

// Generate differentiated versions
export const generateDifferentiatedVersions = async (materialId) => {
  try {
    const response = await axios.post(`${API_URL}/differentiate/${materialId}`);
    return response.data;
  } catch (error) {
    console.error('Error generating differentiated versions:', error);
    // For development, return mock differentiated versions
    await simulateDelay(1500);
    
    const originalMaterial = mockStudyMaterials.find(m => m.id === materialId);
    if (!originalMaterial) {
      throw new Error('Material not found');
    }
    
    return {
      original: originalMaterial,
      differentiated: [
        {
          id: `${materialId}-beginner`,
          ...originalMaterial,
          title: `${originalMaterial.title} (Simplified)`,
          difficultyLevel: 'Beginner',
          content: `Simplified version of: ${originalMaterial.content.substring(0, 150)}...`,
          updatedAt: new Date().toISOString()
        },
        {
          id: `${materialId}-advanced`,
          ...originalMaterial,
          title: `${originalMaterial.title} (Advanced)`,
          difficultyLevel: 'Advanced',
          content: `Advanced version with extended concepts: ${originalMaterial.content.substring(0, 150)}...`,
          updatedAt: new Date().toISOString()
        }
      ]
    };
  }
}; 