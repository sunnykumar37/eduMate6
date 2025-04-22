import React, { useState, useEffect } from 'react';
import { 
  createCurriculum, 
  updateCurriculum, 
  getCurriculumById 
} from '../../../services/teacher-tools/curriculumService';

const CurriculumForm = ({ curriculumId, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    standardId: '',
    subject: '',
    gradeLevel: '',
    description: '',
    objectives: [''],
    keywords: ['']
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (curriculumId) {
      setIsEditing(true);
      fetchCurriculum(curriculumId);
    }
  }, [curriculumId]);

  const fetchCurriculum = async (id) => {
    try {
      setLoading(true);
      const data = await getCurriculumById(id);
      
      // Ensure arrays have at least one empty field for UI
      const objectives = data.objectives.length > 0 ? data.objectives : [''];
      const keywords = data.keywords.length > 0 ? data.keywords : [''];
      
      setFormData({
        ...data,
        objectives,
        keywords
      });
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch curriculum standard');
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleArrayChange = (e, index, fieldName) => {
    const { value } = e.target;
    setFormData(prev => {
      const newArray = [...prev[fieldName]];
      newArray[index] = value;
      return {
        ...prev,
        [fieldName]: newArray
      };
    });
  };

  const addArrayItem = (fieldName) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: [...prev[fieldName], '']
    }));
  };

  const removeArrayItem = (index, fieldName) => {
    setFormData(prev => {
      const newArray = [...prev[fieldName]];
      newArray.splice(index, 1);
      
      // Ensure array always has at least one item (can be empty)
      if (newArray.length === 0) {
        newArray.push('');
      }
      
      return {
        ...prev,
        [fieldName]: newArray
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clean up any empty fields in arrays
    const cleanFormData = {
      ...formData,
      objectives: formData.objectives.filter(obj => obj.trim() !== ''),
      keywords: formData.keywords.filter(kw => kw.trim() !== '')
    };
    
    try {
      setLoading(true);
      setError('');
      
      if (isEditing) {
        await updateCurriculum(curriculumId, cleanFormData);
      } else {
        await createCurriculum(cleanFormData);
      }
      
      setLoading(false);
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setError(`Failed to ${isEditing ? 'update' : 'create'} curriculum standard`);
      setLoading(false);
    }
  };

  return (
    <div className="curriculum-form">
      <h2>{isEditing ? 'Edit Curriculum Standard' : 'Add New Curriculum Standard'}</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="standardId">Standard ID*:</label>
          <input
            type="text"
            id="standardId"
            name="standardId"
            value={formData.standardId}
            onChange={handleChange}
            placeholder="E.g. MATH.5.NBT.1"
            required
          />
        </div>
        
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
        
        <div className="form-group">
          <label htmlFor="description">Description*:</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Detailed description of the curriculum standard"
            rows={4}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Objectives*:</label>
          {formData.objectives.map((objective, index) => (
            <div key={index} className="array-item">
              <input
                type="text"
                value={objective}
                onChange={(e) => handleArrayChange(e, index, 'objectives')}
                placeholder="Enter an objective"
                required={index === 0} // At least one objective is required
              />
              <button
                type="button"
                className="btn-remove"
                onClick={() => removeArrayItem(index, 'objectives')}
                disabled={formData.objectives.length === 1}
              >
                −
              </button>
            </div>
          ))}
          <button
            type="button"
            className="btn-add"
            onClick={() => addArrayItem('objectives')}
          >
            + Add Objective
          </button>
        </div>
        
        <div className="form-group">
          <label>Keywords:</label>
          {formData.keywords.map((keyword, index) => (
            <div key={index} className="array-item">
              <input
                type="text"
                value={keyword}
                onChange={(e) => handleArrayChange(e, index, 'keywords')}
                placeholder="Enter a keyword"
              />
              <button
                type="button"
                className="btn-remove"
                onClick={() => removeArrayItem(index, 'keywords')}
                disabled={formData.keywords.length === 1}
              >
                −
              </button>
            </div>
          ))}
          <button
            type="button"
            className="btn-add"
            onClick={() => addArrayItem('keywords')}
          >
            + Add Keyword
          </button>
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

export default CurriculumForm; 