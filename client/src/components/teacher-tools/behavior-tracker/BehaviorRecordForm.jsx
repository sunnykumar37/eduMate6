import React, { useState, useEffect } from 'react';
import { 
  createBehaviorRecord, 
  updateBehaviorRecord, 
  getBehaviorRecordById 
} from '../../../services/teacher-tools/behaviorTrackerService';
import './BehaviorTracker.css';

const BehaviorRecordForm = ({ recordId, onCancel, onSuccess }) => {
  const initialFormState = {
    studentName: '',
    gradeLevel: '',
    date: new Date().toISOString().split('T')[0],
    behaviorType: 'Neutral',
    category: '',
    description: '',
    actionTaken: '',
    followUpNeeded: false,
    followUpNotes: '',
    parentNotified: false
  };
  
  const [formData, setFormData] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  
  // Fetch record data if editing
  useEffect(() => {
    if (recordId) {
      setIsEditing(true);
      fetchRecordData();
    } else {
      setIsEditing(false);
      setFormData(initialFormState);
    }
  }, [recordId]);
  
  const fetchRecordData = async () => {
    setLoading(true);
    try {
      const recordData = await getBehaviorRecordById(recordId);
      
      // Format date for the input field
      const formattedData = {
        ...recordData,
        date: new Date(recordData.date).toISOString().split('T')[0]
      };
      
      setFormData(formattedData);
      setError(null);
    } catch (err) {
      setError('Failed to fetch record data. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Make API call to create or update record
      if (isEditing) {
        await updateBehaviorRecord(recordId, formData);
      } else {
        await createBehaviorRecord(formData);
      }
      
      // Reset form and notify parent component
      if (!isEditing) {
        setFormData(initialFormState);
      }
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setError(`Failed to ${isEditing ? 'update' : 'create'} behavior record. Please check your inputs and try again.`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="behavior-record-form">
      <h2>{isEditing ? 'Edit Behavior Record' : 'Record New Behavior'}</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="studentName">Student Name*</label>
            <input
              type="text"
              id="studentName"
              name="studentName"
              value={formData.studentName}
              onChange={handleChange}
              required
              placeholder="Enter student name"
              disabled={loading}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="gradeLevel">Grade Level*</label>
            <select
              id="gradeLevel"
              name="gradeLevel"
              value={formData.gradeLevel}
              onChange={handleChange}
              required
              disabled={loading}
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
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="date">Date*</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="behaviorType">Behavior Type*</label>
            <select
              id="behaviorType"
              name="behaviorType"
              value={formData.behaviorType}
              onChange={handleChange}
              required
              disabled={loading}
            >
              <option value="Positive">Positive</option>
              <option value="Concerning">Concerning</option>
              <option value="Neutral">Neutral</option>
            </select>
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group full-width">
            <label htmlFor="category">Category*</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              disabled={loading}
            >
              <option value="">Select Category</option>
              <option value="Academic Engagement">Academic Engagement</option>
              <option value="Classroom Conduct">Classroom Conduct</option>
              <option value="Social Interaction">Social Interaction</option>
              <option value="Emotional Regulation">Emotional Regulation</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group full-width">
            <label htmlFor="description">Description*</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              placeholder="Describe the behavior in detail..."
              rows="4"
              disabled={loading}
            ></textarea>
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group full-width">
            <label htmlFor="actionTaken">Action Taken</label>
            <textarea
              id="actionTaken"
              name="actionTaken"
              value={formData.actionTaken}
              onChange={handleChange}
              placeholder="Describe any actions taken in response to the behavior..."
              rows="3"
              disabled={loading}
            ></textarea>
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group checkbox-group">
            <input
              type="checkbox"
              id="followUpNeeded"
              name="followUpNeeded"
              checked={formData.followUpNeeded}
              onChange={handleChange}
              disabled={loading}
            />
            <label htmlFor="followUpNeeded">Follow-up Needed</label>
          </div>
          
          <div className="form-group checkbox-group">
            <input
              type="checkbox"
              id="parentNotified"
              name="parentNotified"
              checked={formData.parentNotified}
              onChange={handleChange}
              disabled={loading}
            />
            <label htmlFor="parentNotified">Parent Notified</label>
          </div>
        </div>
        
        {formData.followUpNeeded && (
          <div className="form-row">
            <div className="form-group full-width">
              <label htmlFor="followUpNotes">Follow-up Notes</label>
              <textarea
                id="followUpNotes"
                name="followUpNotes"
                value={formData.followUpNotes}
                onChange={handleChange}
                placeholder="Enter follow-up plan or notes..."
                rows="3"
                disabled={loading}
              ></textarea>
            </div>
          </div>
        )}
        
        <div className="form-actions">
          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={loading}
          >
            {loading ? 'Saving...' : isEditing ? 'Update Record' : 'Save Record'}
          </button>
          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default BehaviorRecordForm; 