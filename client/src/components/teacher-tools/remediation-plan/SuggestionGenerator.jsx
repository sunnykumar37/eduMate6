import React, { useState } from 'react';
import { generateSuggestions } from '../../../services/teacher-tools/remediationPlanService';

const SuggestionGenerator = ({ onSuggestionsGenerated }) => {
  const [formData, setFormData] = useState({
    studentName: '',
    studentId: '',
    subject: '',
    gradeLevel: '',
    areas: ['']
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAreaChange = (index, value) => {
    const updatedAreas = [...formData.areas];
    updatedAreas[index] = value;
    setFormData(prev => ({
      ...prev,
      areas: updatedAreas
    }));
  };

  const handleAddArea = () => {
    setFormData(prev => ({
      ...prev,
      areas: [...prev.areas, '']
    }));
  };

  const handleRemoveArea = (index) => {
    if (formData.areas.length === 1) return;
    const updatedAreas = formData.areas.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      areas: updatedAreas
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Filter out any empty areas
    const filteredAreas = formData.areas.filter(area => area.trim());
    
    if (filteredAreas.length === 0) {
      setError('At least one area of concern is required');
      setLoading(false);
      return;
    }
    
    try {
      const suggestions = await generateSuggestions({
        subject: formData.subject,
        gradeLevel: formData.gradeLevel,
        areas: filteredAreas
      });
      
      // Combine the suggestion template with the student info
      const planTemplate = {
        ...suggestions,
        studentName: formData.studentName,
        studentId: formData.studentId,
        subject: formData.subject,
        gradeLevel: formData.gradeLevel,
        startDate: new Date()
      };
      
      setLoading(false);
      
      if (onSuggestionsGenerated) {
        onSuggestionsGenerated(planTemplate);
      }
    } catch (err) {
      setError('Failed to generate remediation plan suggestions');
      setLoading(false);
    }
  };

  return (
    <div className="suggestion-generator">
      <h2>Generate Remediation Plan</h2>
      
      <div className="suggestion-description">
        <p>
          Generate personalized remediation plan suggestions by entering student information 
          and areas of concern. The system will create a plan with appropriate goals, 
          activities, and resources based on curriculum standards.
        </p>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="studentName">Student Name*:</label>
            <input
              type="text"
              id="studentName"
              name="studentName"
              value={formData.studentName}
              onChange={handleChange}
              placeholder="Enter student name"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="studentId">Student ID*:</label>
            <input
              type="text"
              id="studentId"
              name="studentId"
              value={formData.studentId}
              onChange={handleChange}
              placeholder="Enter student ID"
              required
            />
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="subject">Subject*:</label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="E.g. Mathematics, Reading"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="gradeLevel">Grade Level*:</label>
            <input
              type="text"
              id="gradeLevel"
              name="gradeLevel"
              value={formData.gradeLevel}
              onChange={handleChange}
              placeholder="E.g. Grade 3, 9th Grade"
              required
            />
          </div>
        </div>
        
        <div className="form-group">
          <label>Areas of Concern*:</label>
          {formData.areas.map((area, index) => (
            <div key={index} className="area-input">
              <input
                type="text"
                value={area}
                onChange={(e) => handleAreaChange(index, e.target.value)}
                placeholder="E.g. Fraction operations, Reading comprehension"
                required
              />
              <button 
                type="button" 
                className="btn-remove-area"
                onClick={() => handleRemoveArea(index)}
              >
                Remove
              </button>
            </div>
          ))}
          <button 
            type="button" 
            className="btn-add-area"
            onClick={handleAddArea}
          >
            Add Area
          </button>
        </div>
        
        <div className="form-actions">
          <button type="submit" className="btn-generate" disabled={loading}>
            {loading ? 'Generating...' : 'Generate Plan Suggestions'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SuggestionGenerator; 