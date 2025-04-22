import React, { useState, useEffect } from 'react';
import { createAssignment, updateAssignment, getAssignmentById } from '../../../services/teacher-tools/assignmentService';
import { getAllCurriculum } from '../../../services/teacher-tools/curriculumService';
import RubricGenerator from './RubricGenerator';

const AssignmentForm = ({ assignmentId, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    instructions: '',
    subject: '',
    gradeLevel: '',
    dueDate: '',
    pointsPossible: 100,
    curriculumStandards: [],
    rubric: []
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [curricula, setCurricula] = useState([]);
  const [showRubricGenerator, setShowRubricGenerator] = useState(false);

  useEffect(() => {
    fetchCurricula();
    
    if (assignmentId) {
      setIsEditing(true);
      fetchAssignment(assignmentId);
    }
  }, [assignmentId]);

  const fetchCurricula = async () => {
    try {
      const data = await getAllCurriculum();
      setCurricula(data);
    } catch (err) {
      setError('Failed to fetch curriculum standards');
    }
  };

  const fetchAssignment = async (id) => {
    try {
      setLoading(true);
      const data = await getAssignmentById(id);
      
      // Format date for the input field (yyyy-MM-dd)
      let formattedData = { ...data };
      if (data.dueDate) {
        const date = new Date(data.dueDate);
        formattedData.dueDate = date.toISOString().split('T')[0];
      }
      
      // Ensure curriculum standards are in the right format
      if (data.curriculumStandards) {
        formattedData.curriculumStandards = data.curriculumStandards.map(
          std => typeof std === 'object' ? std._id : std
        );
      }
      
      setFormData(formattedData);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch assignment');
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'pointsPossible') {
      // Ensure pointsPossible is a number
      setFormData(prev => ({
        ...prev,
        [name]: parseInt(value, 10) || 0
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleCurriculumStandardsChange = (e) => {
    // Get selected options from multi-select
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    setFormData(prev => ({
      ...prev,
      curriculumStandards: selectedOptions
    }));
  };

  const handleRubricGenerated = (rubric) => {
    setFormData(prev => ({
      ...prev,
      rubric
    }));
    
    // Close the rubric generator after rubric is generated
    setShowRubricGenerator(false);
  };

  const handleDeleteRubricCriteria = (index) => {
    setFormData(prev => ({
      ...prev,
      rubric: prev.rubric.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      if (isEditing) {
        await updateAssignment(assignmentId, formData);
      } else {
        await createAssignment(formData);
      }
      
      setLoading(false);
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setError(`Failed to ${isEditing ? 'update' : 'create'} assignment`);
      setLoading(false);
    }
  };

  return (
    <div className="assignment-form">
      <h2>{isEditing ? 'Edit Assignment' : 'Create Assignment'}</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title*:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Assignment title"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Description*:</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Brief description of the assignment"
            rows={2}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="instructions">Instructions*:</label>
          <textarea
            id="instructions"
            name="instructions"
            value={formData.instructions}
            onChange={handleChange}
            placeholder="Detailed instructions for students"
            rows={5}
            required
          />
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
              placeholder="E.g. Mathematics, Science"
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
              placeholder="E.g. Grade 5, High School"
              required
            />
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="dueDate">Due Date:</label>
            <input
              type="date"
              id="dueDate"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="pointsPossible">Points Possible*:</label>
            <input
              type="number"
              id="pointsPossible"
              name="pointsPossible"
              value={formData.pointsPossible}
              onChange={handleChange}
              min={1}
              required
            />
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="curriculumStandards">Curriculum Standards:</label>
          <select
            id="curriculumStandards"
            name="curriculumStandards"
            multiple
            value={formData.curriculumStandards}
            onChange={handleCurriculumStandardsChange}
            size={5}
          >
            {curricula.map(curr => (
              <option key={curr._id} value={curr._id}>
                {curr.standardId}: {curr.subject} ({curr.gradeLevel})
              </option>
            ))}
          </select>
          <small>Hold Ctrl or Cmd to select multiple standards</small>
        </div>
        
        <div className="form-group">
          <div className="rubric-header">
            <label>Rubric:</label>
            {!showRubricGenerator && (
              <button 
                type="button" 
                className="btn-generate-rubric"
                onClick={() => setShowRubricGenerator(true)}
              >
                {formData.rubric.length > 0 ? 'Regenerate Rubric' : 'Generate Rubric'}
              </button>
            )}
          </div>
          
          {showRubricGenerator ? (
            <div className="rubric-generator-container">
              <RubricGenerator 
                assignmentData={formData} 
                onRubricGenerated={handleRubricGenerated} 
              />
              <button 
                type="button" 
                className="btn-cancel-rubric"
                onClick={() => setShowRubricGenerator(false)}
              >
                Cancel
              </button>
            </div>
          ) : formData.rubric.length > 0 ? (
            <div className="rubric-table-container">
              <table className="rubric-table">
                <thead>
                  <tr>
                    <th>Criteria</th>
                    <th>Description</th>
                    <th>Points</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.rubric.map((criteria, index) => (
                    <tr key={index}>
                      <td>{criteria.name}</td>
                      <td>{criteria.description}</td>
                      <td>{criteria.pointsPossible}</td>
                      <td>
                        <button
                          type="button"
                          className="btn-delete-criteria"
                          onClick={() => handleDeleteRubricCriteria(index)}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="no-rubric-message">No rubric generated yet. Click "Generate Rubric" to create one.</p>
          )}
        </div>
        
        <div className="form-actions">
          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? 'Saving...' : isEditing ? 'Update' : 'Create'}
          </button>
          <button type="button" className="btn-cancel" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AssignmentForm; 