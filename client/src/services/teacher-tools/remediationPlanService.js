import axios from 'axios';

const API_URL = '/api/teacher-tools/remediation-plans';

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

// Get remediation plan by ID
export const getRemediationPlanById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching remediation plan with ID ${id}:`, error);
    throw error;
  }
};

// Create new remediation plan
export const createRemediationPlan = async (planData) => {
  try {
    const response = await axios.post(API_URL, planData);
    return response.data;
  } catch (error) {
    console.error('Error creating remediation plan:', error);
    throw error;
  }
};

// Update remediation plan
export const updateRemediationPlan = async (id, planData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, planData);
    return response.data;
  } catch (error) {
    console.error(`Error updating remediation plan with ID ${id}:`, error);
    throw error;
  }
};

// Delete remediation plan
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
export const searchRemediationPlans = async (searchParams) => {
  try {
    const queryString = Object.entries(searchParams)
      .filter(([_, value]) => value)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&');
    
    const response = await axios.get(`${API_URL}/search/criteria?${queryString}`);
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