import axios from 'axios';

const API_URL = '/api/teacher-tools/behavior-tracker';

// Mock data for development
const mockBehaviorRecords = [
  {
    id: '1',
    studentName: 'Emily Johnson',
    gradeLevel: '3',
    date: '2023-11-05T10:30:00.000Z',
    behaviorType: 'Positive',
    category: 'Academic Engagement',
    description: 'Emily was very focused during math lesson and helped other students who were struggling with the concept.',
    actionTaken: 'Provided positive reinforcement and gave a class participation point.',
    followUpNeeded: false,
    parentNotified: false
  },
  {
    id: '2',
    studentName: 'Jacob Smith',
    gradeLevel: '3',
    date: '2023-11-04T09:15:00.000Z',
    behaviorType: 'Concerning',
    category: 'Classroom Conduct',
    description: 'Jacob was disruptive during reading time, talking loudly and distracting other students.',
    actionTaken: 'Verbal warning and moved seat temporarily.',
    followUpNeeded: true,
    followUpNotes: 'Schedule meeting with parents if behavior continues this week.',
    parentNotified: false
  },
  {
    id: '3',
    studentName: 'Sophia Martinez',
    gradeLevel: '3',
    date: '2023-11-03T13:45:00.000Z',
    behaviorType: 'Positive',
    category: 'Social Interaction',
    description: 'Sophia helped a new student adjust to the classroom routine and made them feel welcome.',
    actionTaken: 'Acknowledged her kindness in front of class and gave a kindness award.',
    followUpNeeded: false,
    parentNotified: true
  },
  {
    id: '4',
    studentName: 'Jacob Smith',
    gradeLevel: '3',
    date: '2023-11-02T11:20:00.000Z',
    behaviorType: 'Concerning',
    category: 'Emotional Regulation',
    description: 'Jacob had difficulty controlling his frustration during group work and knocked over his chair.',
    actionTaken: 'Cool down time in quiet corner, followed by discussion about appropriate ways to express frustration.',
    followUpNeeded: true,
    followUpNotes: 'Consider implementing a behavior chart for tracking emotional regulation.',
    parentNotified: true
  },
  {
    id: '5',
    studentName: 'Aiden Wilson',
    gradeLevel: '3',
    date: '2023-11-01T14:10:00.000Z',
    behaviorType: 'Neutral',
    category: 'Academic Engagement',
    description: 'Aiden completed the minimum requirements for the assignment but did not engage in extension activities.',
    actionTaken: 'Discussed potential interest areas for future engagement.',
    followUpNeeded: false,
    parentNotified: false
  }
];

// Function to simulate API delay
const simulateDelay = (ms = 600) => new Promise(resolve => setTimeout(resolve, ms));

// Get all behavior records
export const getAllBehaviorRecords = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching behavior records:', error);
    // For development, return mock data
    await simulateDelay();
    return mockBehaviorRecords;
  }
};

// Get a specific behavior record by ID
export const getBehaviorRecordById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching behavior record with ID ${id}:`, error);
    // For development, return mock data
    await simulateDelay();
    return mockBehaviorRecords.find(record => record.id === id);
  }
};

// Create a new behavior record
export const createBehaviorRecord = async (recordData) => {
  try {
    const response = await axios.post(API_URL, recordData);
    return response.data;
  } catch (error) {
    console.error('Error creating behavior record:', error);
    throw error;
  }
};

// Update an existing behavior record
export const updateBehaviorRecord = async (id, recordData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, recordData);
    return response.data;
  } catch (error) {
    console.error(`Error updating behavior record with ID ${id}:`, error);
    throw error;
  }
};

// Delete a behavior record
export const deleteBehaviorRecord = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting behavior record with ID ${id}:`, error);
    throw error;
  }
};

// Search behavior records
export const searchBehaviorRecords = async (searchParams) => {
  try {
    const queryString = Object.entries(searchParams)
      .filter(([_, value]) => value)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&');
    
    const response = await axios.get(`${API_URL}/search?${queryString}`);
    return response.data;
  } catch (error) {
    console.error('Error searching behavior records:', error);
    // For development, filter mock data based on search params
    await simulateDelay();
    
    let filteredRecords = [...mockBehaviorRecords];
    
    if (searchParams.studentName) {
      filteredRecords = filteredRecords.filter(record => 
        record.studentName.toLowerCase().includes(searchParams.studentName.toLowerCase())
      );
    }
    
    if (searchParams.behaviorType) {
      filteredRecords = filteredRecords.filter(record => 
        record.behaviorType === searchParams.behaviorType
      );
    }
    
    if (searchParams.category) {
      filteredRecords = filteredRecords.filter(record => 
        record.category === searchParams.category
      );
    }
    
    if (searchParams.followUpNeeded) {
      const followUpValue = searchParams.followUpNeeded === 'true';
      filteredRecords = filteredRecords.filter(record => 
        record.followUpNeeded === followUpValue
      );
    }
    
    return filteredRecords;
  }
};

// Get behavior summary for a student
export const getStudentBehaviorSummary = async (studentName) => {
  try {
    const response = await axios.get(`${API_URL}/summary/student/${encodeURIComponent(studentName)}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching behavior summary for student ${studentName}:`, error);
    
    // For development, generate summary from mock data
    await simulateDelay();
    
    const studentRecords = mockBehaviorRecords.filter(record =>
      record.studentName.toLowerCase().includes(studentName.toLowerCase())
    );
    
    // Generate type counts
    const typeCounts = [];
    const typeMap = {};
    studentRecords.forEach(record => {
      if (!typeMap[record.behaviorType]) {
        typeMap[record.behaviorType] = 0;
      }
      typeMap[record.behaviorType]++;
    });
    
    Object.entries(typeMap).forEach(([type, count]) => {
      typeCounts.push({ _id: type, count });
    });
    
    // Generate category counts
    const categoryCounts = [];
    const categoryMap = {};
    studentRecords.forEach(record => {
      if (!categoryMap[record.category]) {
        categoryMap[record.category] = 0;
      }
      categoryMap[record.category]++;
    });
    
    Object.entries(categoryMap).forEach(([category, count]) => {
      categoryCounts.push({ _id: category, count });
    });
    
    // Get recent records
    const recentRecords = studentRecords
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);
    
    return {
      typeCounts,
      categoryCounts,
      recentRecords
    };
  }
}; 