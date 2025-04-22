import React, { useState, useEffect } from 'react';
import { 
  createRemediationPlan,
  updateRemediationPlan,
  getRemediationPlanById
} from '../../../services/remediationPlanService';

const RemediationPlanForm = ({ planId, onSuccess, onCancel }) => {
  const initialFormState = {
    studentName: '',
    gradeLevel: '',
    subject: '',
    startDate: '',
    endDate: '',
    status: 'Not Started',
    goals: '',
    interventions: '',
    assessmentCriteria: '',
    notes: ''
  };

  const [formData, setFormData] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // If planId is provided, fetch the plan data for editing
  useEffect(() => {
    if (planId) {
      fetchPlanData();
    }
  }, [planId]);

  const fetchPlanData = async () => {
    try {
      setLoading(true);
      const response = await getRemediationPlanById(planId);
      
      // Convert dates to local date string format for form inputs
      const planData = {
        ...response,
        startDate: response.startDate ? new Date(response.startDate).toISOString().split('T')[0] : '',
        endDate: response.endDate ? new Date(response.endDate).toISOString().split('T')[0] : ''
      };
      
      setFormData(planData);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch plan data. Please try again.');
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError('');
      
      // Prepare data for submission
      const submissionData = {
        ...formData,
        // Ensure dates are in the correct format
        startDate: formData.startDate ? new Date(formData.startDate).toISOString() : null,
        endDate: formData.endDate ? new Date(formData.endDate).toISOString() : null
      };
      
      if (planId) {
        // Update existing plan
        await updateRemediationPlan(planId, submissionData);
      } else {
        // Create new plan
        await createRemediationPlan(submissionData);
      }
      
      setLoading(false);
      onSuccess();
    } catch (err) {
      setError('Failed to save remediation plan. Please try again.');
      setLoading(false);
    }
  };

  if (loading && planId) {
    return <div className="loading">Loading plan data...</div>;
  }

  return (
    <div className="remediation-plan-form-container">
      <h2>{planId ? 'Edit Remediation Plan' : 'Create New Remediation Plan'}</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="remediation-plan-form">
        <div className="form-group">
          <label htmlFor="studentName">Student Name</label>
          <input
            type="text"
            id="studentName"
            name="studentName"
            value={formData.studentName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="gradeLevel">Grade Level</label>
            <select
              id="gradeLevel"
              name="gradeLevel"
              value={formData.gradeLevel}
              onChange={handleChange}
              required
            >
              <option value="">Select Grade</option>
              <option value="K">Kindergarten</option>
              <option value="1">1st Grade</option>
              <option value="2">2nd Grade</option>
              <option value="3">3rd Grade</option>
              <option value="4">4th Grade</option>
              <option value="5">5th Grade</option>
              <option value="6">6th Grade</option>
              <option value="7">7th Grade</option>
              <option value="8">8th Grade</option>
              <option value="9">9th Grade</option>
              <option value="10">10th Grade</option>
              <option value="11">11th Grade</option>
              <option value="12">12th Grade</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="subject">Subject</label>
            <select
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
            >
              <option value="">Select Subject</option>
              <option value="Math">Mathematics</option>
              <option value="ELA">English Language Arts</option>
              <option value="Science">Science</option>
              <option value="Social Studies">Social Studies</option>
              <option value="Reading">Reading</option>
              <option value="Writing">Writing</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="startDate">Start Date</label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="endDate">End Date</label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
            >
              <option value="Not Started">Not Started</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="On Hold">On Hold</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="goals">Learning Goals</label>
          <textarea
            id="goals"
            name="goals"
            value={formData.goals}
            onChange={handleChange}
            required
            placeholder="Describe the specific learning goals for this remediation plan"
            rows={3}
          />
        </div>

        <div className="form-group">
          <label htmlFor="interventions">Interventions</label>
          <textarea
            id="interventions"
            name="interventions"
            value={formData.interventions}
            onChange={handleChange}
            required
            placeholder="List specific strategies and activities to support the student"
            rows={4}
          />
        </div>

        <div className="form-group">
          <label htmlFor="assessmentCriteria">Assessment Criteria</label>
          <textarea
            id="assessmentCriteria"
            name="assessmentCriteria"
            value={formData.assessmentCriteria}
            onChange={handleChange}
            required
            placeholder="Describe how progress will be measured and evaluated"
            rows={3}
          />
        </div>

        <div className="form-group">
          <label htmlFor="notes">Additional Notes</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Any additional information or observations"
            rows={3}
          />
        </div>

        <div className="form-actions">
          <button type="button" className="btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Saving...' : (planId ? 'Update Plan' : 'Create Plan')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RemediationPlanForm; 